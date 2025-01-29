package app.sportahub.messagingservice.dto.response.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessageResponse(String messageId, String chatroomId, String senderId, String receiverId,
                              String content, Timestamp createdAt ) {
}
