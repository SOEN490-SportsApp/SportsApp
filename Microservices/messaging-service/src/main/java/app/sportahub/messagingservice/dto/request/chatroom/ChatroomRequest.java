package app.sportahub.messagingservice.dto.request.chatroom;

import jakarta.validation.constraints.Size;
import app.sportahub.messagingservice.model.Message;

import java.util.List;
import java.util.Set;

public record ChatroomRequest(String createdBy,
                              @Size(min = 1, max = 255) Set<String> members, List<Message> messages, Boolean isEvent,
                              Boolean unread) {
}
