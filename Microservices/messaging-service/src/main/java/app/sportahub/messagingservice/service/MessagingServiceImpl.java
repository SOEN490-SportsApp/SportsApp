package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.exception.UserAddingThemselvesToChatroomMemberSetException;
import app.sportahub.messagingservice.mapper.ChatroomMapper;
import app.sportahub.messagingservice.mapper.MessageMapper;
import app.sportahub.messagingservice.model.Chatroom;
import app.sportahub.messagingservice.model.Message;
import app.sportahub.messagingservice.repository.ChatroomRepository;
import app.sportahub.messagingservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessagingServiceImpl  implements MessagingService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatroomRepository chatroomRepository;
    private final ChatroomMapper chatroomMapper;
    private final MessageMapper messageMapper;

    @Override
    public void processMessage(MessageRequest messageRequest) {
        Message message = messageMapper.messageRequestToMessage(messageRequest)
                .toBuilder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        String chatroomId = getOrCreateChatroom(message.getSenderId(), message.getReceiverIds(),
                true).chatroomId();
        message.setChatroomId(chatroomId);
        Message savedMessage = messageRepository.save(message);
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId);
        List<Message> messages = chatroom.getMessages();
        messages.addFirst(savedMessage);
        chatroom.setMessages(messages);
        chatroomRepository.save(chatroom);

        messagingTemplate.convertAndSend("/topic/chatroom/" + chatroomId, savedMessage);

        /*
        for (String receiverId : message.getReceiverIds())
            messagingTemplate.convertAndSendToUser(receiverId,"/queue/messages", savedMessage);

         */
    }

    @Override
    public ChatroomResponse getOrCreateChatroom(String senderId, Set<String> members, boolean createNewIfNotExists) {
        return chatroomMapper.chatroomToChatroomResponse((chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)
                .or(() -> {
                    if (createNewIfNotExists) {
                        members.add(senderId);
                        Chatroom chatroom = Chatroom.builder()
                                .createdBy(senderId)
                                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                                .members(members)
                                .build();

                        Chatroom savedChatroom = chatroomRepository.save(chatroom);
                        return Optional.of(savedChatroom);
                    }
                    return Optional.empty();
                })).orElse(null));
    }

    @Override
    public List<MessageResponse> getMessages(String chatroomId) {
        List<Message> messages = chatroomRepository.findByChatroomId(chatroomId).getMessages();

        return messages.stream()
                .map(message -> new MessageResponse(message.getMessageId(), message.getChatroomId(),
                        message.getSenderId(), message.getReceiverIds(), message.getContent(), message.getCreatedAt(),
                        message.getAttachments()))
                .toList();
    }

    @Override
    public List<ChatroomResponse> getChatrooms(String userId) {
        Set<String> tempSet = new HashSet<>();
        tempSet.add(userId);
        List<Chatroom> chatrooms = chatroomRepository.findAllByMembersContains(tempSet);

        return chatrooms.stream()
                .map(chatroom -> new ChatroomResponse(chatroom.getChatroomId(), chatroom.getCreatedAt(),
                        chatroom.getCreatedBy(), chatroom.getMembers(), chatroom.getMessages(), chatroom.getIsEvent(),
                        chatroom.getUnread()))
                .toList();
    }

    @Override
    public ChatroomResponse createChatroom(ChatroomRequest chatroomRequest) {
        Chatroom chatroom = chatroomMapper.chatroomRequestToChatroom(chatroomRequest);
        chatroom.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        Set<String> members = chatroom.getMembers();
        members.add(chatroomRequest.createdBy());
        chatroom.setMembers(members);

        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }

    @Override
    public ChatroomResponse getChatroom(String chatroomId) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId);
        return chatroomMapper.chatroomToChatroomResponse(chatroom);
    }
}
