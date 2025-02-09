package app.sportahub.messaging_service.service;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.exception.UserAddingThemselvesToChatroomMemberSetException;
import app.sportahub.messagingservice.mapper.ChatroomMapper;
import app.sportahub.messagingservice.mapper.MessageMapper;
import app.sportahub.messagingservice.model.Chatroom;
import app.sportahub.messagingservice.model.Message;
import app.sportahub.messagingservice.repository.ChatroomRepository;
import app.sportahub.messagingservice.repository.MessageRepository;
import app.sportahub.messagingservice.service.MessagingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class MessagingServiceTest {

    @Mock
    private ChatroomRepository chatroomRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MessagingServiceImpl messagingService;

    private final ChatroomMapper chatroomMapper = Mappers.getMapper(ChatroomMapper.class);
    private final MessageMapper messageMapper = Mappers.getMapper(MessageMapper.class);

    @BeforeEach
    void setUp() {
        messagingService = new MessagingServiceImpl(messageRepository, messagingTemplate, chatroomRepository,
                chatroomMapper, messageMapper);
    }

    @Test
    public void getOrCreateChatroomShouldSucceedWhenChatroomDoesNotExist() {
        //Arrange
        String senderId = "testSenderId";
        String memberId = "testMemberId";
        Set<String> members = new HashSet<>();
        members.add(memberId);
        boolean createNewIfNotExists = true;
        Chatroom chatroom = Chatroom.builder()
                .createdBy(senderId)
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .members(members)
                .build();

        when(chatroomRepository.save(any())).thenReturn(chatroom);
        when(chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)).thenReturn(Optional.empty());

        //Act
        ChatroomResponse chatroomResponse = messagingService.getOrCreateChatroom(senderId,members,createNewIfNotExists);

        //Assert
        assertNotNull(chatroomResponse);
        assertEquals(senderId, chatroomResponse.createdBy());
        verify(chatroomRepository, times(1)).findByCreatedByAndMembersEquals(senderId,members);
        verify(chatroomRepository, times(1)).save(any());
    }

    @Test
    public void getOrCreateChatroomShouldSucceedWhenChatroomExists() {
        //Arrange
        String senderId = "testSenderId";
        String memberId = "testMemberId";
        Set<String> members = new HashSet<>();
        members.add(memberId);
        boolean createNewIfNotExists = true;
        Chatroom chatroom = Chatroom.builder()
                .createdBy(senderId)
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .members(members)
                .build();

        when(chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)).thenReturn(Optional.ofNullable(chatroom));

        //Act
        ChatroomResponse chatroomResponse = messagingService.getOrCreateChatroom(senderId,members,createNewIfNotExists);

        //Assert
        assertNotNull(chatroomResponse);
        assertEquals(senderId, chatroomResponse.createdBy());
        verify(chatroomRepository, times(1)).findByCreatedByAndMembersEquals(senderId,members);
        verify(chatroomRepository, times(0)).save(any());
    }

    @Test
    public void getOrCreateMessageShouldReturnNullWhenBooleanFalseAndChatroomDoesNotExist() {
        //Arrange
        String senderId = "testSenderId";
        String memberId = "testMemberId";
        Set<String> members = new HashSet<>();
        members.add(memberId);
        boolean createNewIfNotExists = false;

        when(chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)).thenReturn(Optional.empty());

        //Act
        ChatroomResponse chatroomResponse = messagingService.getOrCreateChatroom(senderId,members,createNewIfNotExists);

        //Assert
        assertNull(chatroomResponse);
        verify(chatroomRepository, times(1)).findByCreatedByAndMembersEquals(senderId,members);
        verify(chatroomRepository, times(0)).save(any());

    }

    @Test
    public void getOrCreateMessageShouldThrowUserAddingThemselvesToChatroomMemberSetException() {
        //Arrange
        String senderId = "testSenderId";
        String memberId = "testSenderId";
        Set<String> members = new HashSet<>();
        members.add(memberId);
        boolean createNewIfNotExists = true;

        when(chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)).thenReturn(Optional.empty());

        //Act
        UserAddingThemselvesToChatroomMemberSetException exception =
                assertThrows(UserAddingThemselvesToChatroomMemberSetException.class,
                        () ->  messagingService.getOrCreateChatroom(senderId,members,createNewIfNotExists));

        //Assert
        assertEquals("409 CONFLICT \"User with id testSenderId is trying to add themselves to their own chatroom.\"", exception.getMessage());
        verify(chatroomRepository, times(1)).findByCreatedByAndMembersEquals(senderId,members);
        verify(chatroomRepository, times(0)).save(any());
    }

    @Test
    public void processMessageShouldSucceed() {
        // Arrange
        String senderId = "testSenderId";
        String receiverId1 = "testReceiverId1";
        String content = "test message";
        Set<String> receiverIds = new HashSet<>();
        receiverIds.add(receiverId1);
        Chatroom chatroom = Chatroom.builder()
                .createdBy(senderId)
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .members(receiverIds)
                .build();

        MessageRequest messageRequest = new MessageRequest(senderId, receiverIds, content, new ArrayList<>());
        when(messageRepository.save(any())).thenReturn(messageMapper.messageRequestToMessage(messageRequest));
        when(chatroomRepository.findByCreatedByAndMembersEquals(senderId, receiverIds)).thenReturn(Optional.of(chatroom));

        // Act
        messagingService.processMessage(messageRequest);

        // Assert
        verify(messageRepository, times(1)).save(any());
        verify(chatroomRepository, times(1)).findByCreatedByAndMembersEquals(senderId,receiverIds);
        verify(chatroomRepository, times(0)).save(any());
    }

    @Test
    public void getMessagesShouldSucceed() {
        //Arrange
        String senderId = "testSenderId";
        List<Message> messages = new ArrayList<>();
        Message message1 = new Message(
                "testMessageId1",
                "testChatroomId1",
                "testSenderId1",
                Set.of("testReceiverId1", "testReceiverId2"),
                "test message content",
                null,
                new ArrayList<>()
        );
        Message message2 = new Message(
                "testMessageId2",
                "testChatroomId2",
                "testSenderId2",
                Set.of("testReceiverId3", "testReceiverId4"),
                "test message content",
                null,
                new ArrayList<>()
        );
        messages.add(message1);
        messages.add(message2);

        when(messageRepository.findAllBySenderId(senderId)).thenReturn(messages);

        //Act
        List<MessageResponse> messageResponses = messagingService.getMessages(senderId);

        //Assert
        assertNotNull(messageResponses);
        assertEquals(messages.size(), messageResponses.size());
        assertEquals(message1.getSenderId(), messageResponses.get(0).senderId());
        assertEquals(message2.getSenderId(), messageResponses.get(1).senderId());


    }
}
