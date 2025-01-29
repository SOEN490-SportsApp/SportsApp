package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.response.chatroom.ChatRoomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.model.Message;
import java.util.List;
import java.util.Set;

public interface MessagingService {

    void processMessage(Message message);

    List<MessageResponse> getMessages(String senderId, Set<String> receiverIds);

    ChatRoomResponse getOrCreateChatroom(String senderId, Set<String> members, boolean createNewIfNotExists);
}
