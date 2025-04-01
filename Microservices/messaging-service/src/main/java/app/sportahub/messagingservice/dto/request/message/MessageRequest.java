package app.sportahub.messagingservice.dto.request.message;

import app.sportahub.messagingservice.model.Member;

import java.util.Set;
import java.util.List;

public record MessageRequest(String chatroomId, String senderId, String senderName, String senderImage,
                             Set<Member> receivers, String content, List<String> attachments) {
}
