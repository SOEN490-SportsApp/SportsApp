package app.sportahub.messagingservice.dto.response.chatroom;

import app.sportahub.messagingservice.model.Member;
import app.sportahub.messagingservice.model.Message;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatroomResponse(String chatroomId, String chatroomName, Timestamp createdAt, String createdBy,
                               Set<Member> members, List<Message> messages, Boolean isEvent,
                               Boolean unread) {
}
