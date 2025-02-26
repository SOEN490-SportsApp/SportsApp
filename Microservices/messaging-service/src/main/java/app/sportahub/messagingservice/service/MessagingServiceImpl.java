package app.sportahub.messagingservice.service;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
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

        for (String receiverId : message.getReceiverIds())
            messagingTemplate.convertAndSendToUser(receiverId,"/queue/messages", savedMessage);
    }

    @Override
    public List<MessageResponse> getMessages(String senderId) {
        List<Message> messages = messageRepository.findAllBySenderId(senderId);

        return messages.stream()
                .map(message -> new MessageResponse(message.getMessageId(), message.getChatroomId(),
                        message.getSenderId(), message.getReceiverIds(), message.getContent(), message.getCreatedAt(),
                        message.getAttachments()))
                .toList();
    }

    @Override
    public ChatroomResponse getOrCreateChatroom(String senderId, Set<String> members, boolean createNewIfNotExists) {
        return chatroomMapper.chatroomToChatroomResponse((chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)
                .or(() -> {
                    if (createNewIfNotExists) {
                        if(members.contains(senderId))
                            throw new UserAddingThemselvesToChatroomMemberSetException(senderId);

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
}
