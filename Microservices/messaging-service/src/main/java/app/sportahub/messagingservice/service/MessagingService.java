package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;

import java.util.List;
import java.util.Set;

public interface MessagingService {

    void processMessage(MessageRequest messageRequest);

    List<MessageResponse> getMessages(String senderId);

    ChatroomResponse getOrCreateChatroom(String senderId, Set<String> members, boolean createNewIfNotExists);
}
