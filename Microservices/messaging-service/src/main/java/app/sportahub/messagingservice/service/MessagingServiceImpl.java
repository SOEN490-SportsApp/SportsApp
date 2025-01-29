package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.response.chatroom.ChatRoomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.exception.UserAddingThemselvesToChatroomMemberSetException;
import app.sportahub.messagingservice.mapper.ChatroomMapper;
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

    @Override
    public void processMessage(Message message) {
        Message savedMessage = messageRepository.save(message);
        messagingTemplate.convertAndSendToUser(savedMessage.getReceiverId(),"/queue/messages", savedMessage);
    }

    @Override
    public List<MessageResponse> getMessages(String senderId, String receiverId) {
        List<Message> messages = messageRepository.findAllBySenderIdAndReceiverId(senderId, receiverId);

        return messages.stream()
                .map(message -> new MessageResponse(message.getMessageId(), message.getChatroomId(),
                        message.getSenderId(), message.getReceiverId(), message.getContent(), message.getCreatedAt()))
                .toList();
    }

    @Override
    public ChatRoomResponse getOrCreateChatroom(String senderId, Set<String> members, boolean createNewIfNotExists) {
        return chatroomMapper.chatroomToChatroomResponse((chatroomRepository.findByCreatedByAndMembersEquals(senderId, members)
                .or(() -> {
                    if (createNewIfNotExists) {
                        if(members.contains(senderId))
                            throw new UserAddingThemselvesToChatroomMemberSetException(senderId);

                        Chatroom chatroom = Chatroom.builder()
                                .createdBy(senderId)
                                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                                .members(members).build();

                        chatroomRepository.save(chatroom);
                        return Optional.of(chatroom);
                    }
                    return Optional.empty();
                })).orElseThrow());
    }
}
