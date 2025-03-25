package app.sportahub.messagingservice.dto.request.message;

import java.util.Set;
import java.util.List;

public record MessageRequest(String chatroomId, String senderId, String senderName,
                             Set<String> receiverIds, String content, List<String> attachments) {
}
