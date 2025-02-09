package app.sportahub.messagingservice.dto.request;

import java.util.Set;
import java.util.List;

public record MessageRequest(String senderId, Set<String> receiverIds, String content, List<String> attachments) {
}
