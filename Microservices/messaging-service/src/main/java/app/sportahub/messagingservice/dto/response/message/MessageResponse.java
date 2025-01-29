package app.sportahub.messagingservice.dto.response.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.sql.Timestamp;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record MessageResponse(String messageId, String chatroomId, String senderId, Set<String> receiverId,
                              String content, Timestamp createdAt ) {
}
