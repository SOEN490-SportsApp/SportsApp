package app.sportahub.messaging_service.service;

import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.request.message.MessageRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.exception.ChatroomAlreadyExistsException;
import app.sportahub.messagingservice.exception.ChatroomCreatorTryingToRemoveThemselvesFromChatroomException;
import app.sportahub.messagingservice.exception.ChatroomDoesNotExistException;
import app.sportahub.messagingservice.exception.MessageDoesNotExistException;
import app.sportahub.messagingservice.mapper.ChatroomMapper;
import app.sportahub.messagingservice.mapper.MessageMapper;
import app.sportahub.messagingservice.model.Chatroom;
import app.sportahub.messagingservice.model.Member;
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
    private Chatroom chatroom;
    private ChatroomRequest chatroomRequest;
    private Set<String> receiverIds;

    @BeforeEach
    void setUp() {
        messagingService = new MessagingServiceImpl(messageRepository, messagingTemplate, chatroomRepository,
                chatroomMapper, messageMapper);

        chatroom = getChatroom();

        chatroomRequest = new ChatroomRequest(chatroom.getCreatedBy(), chatroom.getChatroomName(), chatroom.getMembers(),
                chatroom.getMessages(), chatroom.getIsEvent(), chatroom.getUnread());

        receiverIds = new HashSet<String>();
        receiverIds.add(chatroom.getCreatedBy());
        receiverIds.add("testReceiverId1");
        receiverIds.add("testReceiverId2");
        receiverIds.add("testReceiverId3");
    }

    Chatroom getChatroom() {
        String chatroomId = "testChatroomId";
        String chatroomName = "testChatroomName";
        Member creator = new Member("testSenderId", "testSenderName", null);
        Member member1 = new Member("testReceiverId1", "testReceiverName1", null);
        Member member2 = new Member("testReceiverId2", "testReceiverName2", null);
        Member member3 = new Member("testReceiverId3", "testReceiverName3", null);

        Set<Member> members = new HashSet<>();
        members.add(creator);
        members.add(member1);
        members.add(member2);
        members.add(member3);
        return Chatroom.builder()
                .chatroomId(chatroomId)
                .chatroomName(chatroomName)
                .createdBy(creator.getUserId())
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .members(members)
                .build();
    }

    Message getMessage(String chatroomId, String senderId, Set<String> receiverIds, String content) {
        String messageId = "testMessageId";
        String senderName = senderId+"name";
        return Message.builder()
                .withMessageId(messageId)
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withChatroomId(chatroomId)
                .withSenderId(senderId)
                .withSenderName(senderName)
                .withReceiverIds(receiverIds)
                .withContent(content)
                .build();
    }

    MessageRequest getMessageRequest(Message message) {
        return new MessageRequest(message.getChatroomId(), message.getSenderId(), message.getSenderName(),
                message.getReceiverIds(), message.getContent(), message.getAttachments());
    }

    @Test
    public void processMessageShouldSucceed() {
        // Arrange
        Message message = getMessage(chatroom.getChatroomId(), "testSenderId", receiverIds,
                "testContent");
        MessageRequest messageRequest = getMessageRequest(message);

        when(messageRepository.save(any())).thenReturn(messageMapper.messageRequestToMessage(messageRequest));
        when(chatroomRepository.findByChatroomId(any())).thenReturn(Optional.of(chatroom));
        when(chatroomRepository.save(any())).thenReturn(chatroom);

        // Act
        messagingService.processMessage(messageRequest);

        // Assert
        verify(messageRepository, times(1)).save(any());
        verify(chatroomRepository, times(1)).save(any());
    }

    @Test
    public void processMessageShouldThrowChatroomDoesNotExistException() {
        // Arrange
        Message message = getMessage(chatroom.getChatroomId(), "testSenderId", receiverIds,
                "testContent");
        MessageRequest messageRequest = getMessageRequest(message);

        when(chatroomRepository.findByChatroomId(messageRequest.chatroomId())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () -> messagingService.processMessage(messageRequest));

        // Assert
        verify(messageRepository, times(0)).save(any());
        verify(chatroomRepository, times(0)).save(any());

    }

    @Test
    public void getMessagesShouldSucceed() {
        //Arrange
       Message message1 = getMessage(chatroom.getChatroomId(), "testSenderId1", receiverIds,
               "testContent1");
       Message message2 = getMessage(chatroom.getChatroomId(), "testSenderId2", receiverIds,
               "testContent2");
       chatroom.setMessages(List.of(message1,message2));
       MessageResponse messageResponse1 = messageMapper.MessageToMessageResponse(message1);
       MessageResponse messageResponse2 = messageMapper.MessageToMessageResponse(message2);
       List<MessageResponse> messages = List.of(messageResponse1,messageResponse2);

        when(chatroomRepository.findByChatroomId(chatroom.getChatroomId())).thenReturn(Optional.of(chatroom));

        //Act
        List<MessageResponse> messageResponses = messagingService.getMessages(chatroom.getChatroomId());

        //Assert
        assertNotNull(messageResponses);
        assertEquals(messages.size(), messageResponses.size());
        assertEquals(message1.getSenderId(), messageResponses.get(0).senderId());
        assertEquals(message2.getSenderId(), messageResponses.get(1).senderId());
    }

    @Test
    public void getMessagesShouldThrowChatroomNotFoundException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(any())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () -> messagingService.getMessages(any()));

        //Assert
        verify(chatroomRepository, times(1)).findByChatroomId(any());

    }

    @Test
    public void getChatroomsShouldSucceed() {
        // Arrange
        List<Chatroom> chatrooms = List.of(chatroom);

        when(chatroomRepository.findAllByMembers_UserId(chatroom.getCreatedBy())).thenReturn(chatrooms);

        // Act
        List<ChatroomResponse> chatroomResponses = messagingService.getChatrooms(chatroom.getCreatedBy());

        //Assert
        verify(chatroomRepository, times(1))
                .findAllByMembers_UserId(chatroom.getCreatedBy());
        assertNotNull(chatroomResponses);
        assertEquals(chatroomResponses.getFirst().chatroomId(), chatrooms.getFirst().getChatroomId());

    }

    @Test
    public void getChatroomsShouldReturnEmptyListWhenNoChatroomsAreFound() {
        // Arrange
        when(chatroomRepository.findAllByMembers_UserId(any(String.class))).thenReturn(List.of());

        // Act
        List<ChatroomResponse> chatroomResponses = messagingService.getChatrooms("1");

        //Assert
        assertNotNull(chatroomResponses);
        assertEquals(0, chatroomResponses.size());

    }

    @Test
    public void createChatroomShouldSucceed() {
        // Arrange
        Chatroom createdChatroom = chatroomMapper.chatroomRequestToChatroom(chatroomRequest);
        when(chatroomRepository.save(any())).thenReturn(chatroom);

        // Act
        ChatroomResponse chatroomResponse = messagingService.createChatroom(chatroomRequest);

        // Assert
        assertNotNull(chatroomResponse);
        assertEquals(chatroomResponse.createdBy(), createdChatroom.getCreatedBy());
        assertEquals(chatroomResponse.chatroomName(), createdChatroom.getChatroomName());
        assertEquals(chatroomResponse.members(), createdChatroom.getMembers());
        verify(chatroomRepository, times(1)).save(any());
        verify(chatroomRepository, times(1))
                .findByCreatedByAndChatroomNameAndMembersEquals(chatroomRequest.createdBy(), chatroomRequest.chatroomName(),
                        chatroomRequest.members());
    }

    @Test
    public void createChatroomShouldThrowChatroomAlreadyExistsException() {
        // Arrange
        when(chatroomRepository.findByCreatedByAndChatroomNameAndMembersEquals(any(), any(), any()))
                .thenReturn(Optional.of(chatroom));

        // Act
        assertThrows(ChatroomAlreadyExistsException.class, () -> messagingService.createChatroom(chatroomRequest));

        // Assert
        verify(chatroomRepository, times(1))
                .findByCreatedByAndChatroomNameAndMembersEquals(any(), any(), any());
    }

    @Test
    public void getChatroomShouldSucceed() {
        // Arrange
        when(chatroomRepository.findByChatroomId(chatroom.getChatroomId())).thenReturn(Optional.of(chatroom));

        // Act
        ChatroomResponse chatroomResponse = messagingService.getChatroom(chatroom.getChatroomId());

        // Assert
        assertNotNull(chatroomResponse);
        assertEquals(chatroomResponse.createdBy(), chatroom.getCreatedBy());
        assertEquals(chatroomResponse.chatroomName(), chatroom.getChatroomName());
        assertEquals(chatroomResponse.members(), chatroom.getMembers());
        verify(chatroomRepository, times(1)).findByChatroomId(chatroom.getChatroomId());
    }

    @Test
    public void getChatroomShouldReturnChatroomDoesNotExistException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(any())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () -> messagingService.getChatroom(any()));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(any());
    }

    @Test
    public void patchChatroomShouldSucceed() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        when(chatroomRepository.save(any(Chatroom.class))).thenReturn(chatroom);

        // Act
        ChatroomResponse chatroomResponse = messagingService.patchChatroom(chatroom.getChatroomId(), chatroomRequest);

        // Assert
        assertNotNull(chatroomResponse);
        assertEquals(chatroomResponse.createdBy(), chatroom.getCreatedBy());
        assertEquals(chatroomResponse.chatroomName(), chatroom.getChatroomName());
        assertEquals(chatroomResponse.members(), chatroom.getMembers());
        verify(chatroomRepository, times(1)).findByChatroomId(chatroom.getChatroomId());
        verify(chatroomRepository, times(1)).save(any(Chatroom.class));
    }

    @Test
    public void patchChatroomShouldThrowChatroomDoesNotExistException() {
        //Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.empty());

        //Act
        assertThrows(ChatroomDoesNotExistException.class, () ->
                messagingService.patchChatroom(chatroom.getChatroomId(), chatroomRequest));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());

    }

    @Test
    public void deleteChatroomShouldSucceed() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        doNothing().when(chatroomRepository).delete(any(Chatroom.class));

        // Act
        messagingService.deleteChatroom(chatroom.getChatroomId());

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(chatroom.getChatroomId());
        verify(chatroomRepository, times(1)).delete(any(Chatroom.class));
    }

    @Test
    public void deleteChatroomShouldThrowChatroomDoesNotExistException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () ->
                messagingService.deleteChatroom("badChatroomId"));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
    }

    @Test
    public void patchMessageShouldSucceed() {
        // Arrange
        Message message = getMessage(chatroom.getChatroomId(), "testSenderId", receiverIds,
                "testContent" );
        MessageRequest messageRequest = getMessageRequest(message);

        when(messageRepository.findByMessageId(anyString())).thenReturn(Optional.of(message));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        // Act
        MessageResponse messageResponse = messagingService.patchMessage(message.getMessageId(), messageRequest);

        // Assert
        assertNotNull(messageResponse);
        assertEquals(messageRequest.chatroomId(), messageResponse.chatroomId());
        assertEquals(messageRequest.senderId(), messageResponse.senderId());
        assertEquals(messageRequest.content(), messageResponse.content());
        verify(messageRepository, times(1)).findByMessageId(message.getMessageId());
        verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    public void patchMessageShouldThrowMessageDoesNotExistException() {
        // Arrange
        when(messageRepository.findByMessageId(anyString())).thenReturn(Optional.empty());

        // Act
        assertThrows(MessageDoesNotExistException.class, () ->
                messagingService.patchMessage("badMessageId", any(MessageRequest.class)));

        // Assert
        verify(messageRepository, times(1)).findByMessageId(anyString());
    }

    @Test
    public void deleteMessageShouldSucceed() {
        // Arrange
        Message message = getMessage(chatroom.getChatroomId(), "testSenderId", receiverIds,
                "testContent" );
        when(messageRepository.findByMessageId(anyString())).thenReturn(Optional.of(message));
        doNothing().when(messageRepository).delete(any(Message.class));

        // Act
        messagingService.deleteMessage(message.getMessageId());

        // Assert
        verify(messageRepository, times(1)).findByMessageId(message.getMessageId());
        verify(messageRepository, times(1)).delete(any(Message.class));
    }

    @Test
    public void deleteMessageShouldThrowMessageDoesNotExistException() {
        // Arrange
        when(messageRepository.findByMessageId(anyString())).thenReturn(Optional.empty());

        // Act
        assertThrows(MessageDoesNotExistException.class, () ->
                messagingService.deleteMessage("badMessageId"));

        // Assert
        verify(messageRepository, times(1)).findByMessageId(anyString());
    }

    @Test
    public void addMembersShouldSucceed() {
        // Arrange
        Set<Member> existingMembers = new HashSet<>(chatroom.getMembers());
        List<Member> newMembers = new ArrayList<>();
        Member newMember1 = new Member("newMemberId1", "newMemberUsername1", null);
        Member newMember2 = new Member("newMemberId2", "newMemberUsername2", null);
        newMembers.add(newMember1);
        newMembers.add(newMember2);
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        when(chatroomRepository.save(any(Chatroom.class))).thenReturn(chatroom);

        // Act
        ChatroomResponse chatroomResponse = messagingService.addMembers(chatroom.getChatroomId(), newMembers);

        // Assert
        assertNotNull(chatroomResponse);
        assertNotEquals(chatroomResponse.members(), existingMembers);
        assertEquals(chatroomResponse.members(), chatroom.getMembers());
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
        verify(chatroomRepository, times(1)).save(any(Chatroom.class));
    }

    @Test
    public void addMembersShouldThrowChatroomDoesNotExistException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () ->
                messagingService.addMembers("badChatroomId", any()));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
    }

    @Test
    public void removeMembersShouldSucceed() {
        // Arrange
        Set<Member> existingMembers = new HashSet<>(chatroom.getMembers());
        Set<Member> modifiedMembers = new HashSet<>(chatroom.getMembers());
        List<Member> membersToRemove = new ArrayList<>();
        Member memberToRemove1 = new Member("testReceiverId1", "testReceiverName1", null);
        Member memberToRemove2 = new Member("testReceiverId2", "testReceiverName2", null);
        membersToRemove.add(memberToRemove1);
        membersToRemove.add(memberToRemove2);
        modifiedMembers.removeAll(membersToRemove);
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        when(chatroomRepository.save(any(Chatroom.class))).thenReturn(chatroom);


        // Act
        ChatroomResponse chatroomResponse = messagingService.removeMembers(chatroom.getChatroomId(), membersToRemove);

        // Assert
        assertNotNull(chatroomResponse);
        assertNotEquals(chatroomResponse.members(), existingMembers);
        assertEquals(chatroomResponse.members(), modifiedMembers);
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
        verify(chatroomRepository, times(1)).save(any(Chatroom.class));
    }

    @Test
    public void removeMembersShouldThrowChatroomDoesNotExistException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.empty());

        // Act
        assertThrows(ChatroomDoesNotExistException.class, () ->
                messagingService.removeMembers("badChatroomId", any()));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
    }

    @Test
    public void removeMemberShouldThrowChatroomCreatorTryingToRemoveThemselvesFromChatroomException() {
        // Arrange
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        Member creator = new Member("testSenderId", "testSenderName", null);
        Member memberToRemove2 = new Member("testReceiverId1", "testReceiverName", null);

        // Act
        assertThrows(ChatroomCreatorTryingToRemoveThemselvesFromChatroomException.class, () ->
                messagingService.removeMembers(chatroom.getChatroomId(),
                        List.of(creator, memberToRemove2)));

        // Assert
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
    }

    @Test
    public void leaveChatroomShouldSucceed() {
        // Arrange
        Set<Member> existingMembers = new HashSet<>(chatroom.getMembers());
        Set<Member> modifiedMembers = new HashSet<>(chatroom.getMembers());
        Member memberToRemove = new Member("testReceiverId1", "testReceiverName1", null);
        modifiedMembers.remove(memberToRemove);
        when(chatroomRepository.findByChatroomId(anyString())).thenReturn(Optional.of(chatroom));
        when(chatroomRepository.save(any(Chatroom.class))).thenReturn(chatroom);

        // Act
        ChatroomResponse chatroomResponse = messagingService.leaveChatroom(chatroom.getChatroomId(), "testReceiverId1");

        //Assert
        assertNotNull(chatroomResponse);
        assertNotEquals(chatroomResponse.members(), existingMembers);
        assertEquals(chatroomResponse.members(), modifiedMembers);
        verify(chatroomRepository, times(1)).findByChatroomId(anyString());
        verify(chatroomRepository, times(1)).save(any(Chatroom.class));
    }
}
