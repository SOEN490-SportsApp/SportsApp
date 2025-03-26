package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.request.message.MessageRequest;
import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;

import java.util.List;
import java.util.Set;

public interface MessagingService {

    void processMessage(MessageRequest messageRequest);

    List<MessageResponse> getMessages(String chatroomId);

    List<ChatroomResponse> getChatrooms(String senderId);

    ChatroomResponse createChatroom(ChatroomRequest chatroomRequest);

    ChatroomResponse getChatroom(String chatroomId);

    ChatroomResponse patchChatroom(String chatroomId, ChatroomRequest chatroomRequest);

    void deleteChatroom(String chatroomId);

    MessageResponse patchMessage(String messageId, MessageRequest messageRequest);

    void deleteMessage(String messageId);

    ChatroomResponse addMembers(String chatroomId, List<String> userIds);

    ChatroomResponse removeMembers(String chatroomId, List<String> userIds);
}
