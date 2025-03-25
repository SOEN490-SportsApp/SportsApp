package app.sportahub.messagingservice.dto.response.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;
import java.util.Set;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessageResponse(String messageId, String chatroomId, String senderId, String senderName,
                              Set<String> receiverId, String content, Timestamp createdAt, List<String> attachments) {
}
