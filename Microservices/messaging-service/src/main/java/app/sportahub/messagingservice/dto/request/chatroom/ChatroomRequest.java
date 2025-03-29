package app.sportahub.messagingservice.dto.request.chatroom;

import app.sportahub.messagingservice.model.Member;
import jakarta.validation.constraints.Size;
import app.sportahub.messagingservice.model.Message;

import java.util.List;
import java.util.Set;

public record ChatroomRequest(String createdBy, String chatroomName,
                              @Size(min = 1, max = 255) Set<Member> members, List<Message> messages, Boolean isEvent,
                              Boolean unread) {
}
