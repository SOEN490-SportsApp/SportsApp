package app.sportahub.eventservice.service.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendEventUpdateNotifications(String eventId, String eventName, List<String> userIds, String updatedAt) {
        for (String userId : userIds) {
            Map<String, Object> payload = Map.of(
                    "userId", userId,
                    "title", "Event Updated",
                    "body", "The event '" + eventName + "' has been updated.",
                    "clickAction", "/events/" + eventId,
                    "icon", "https://example.com/event-update-icon.png",
                    "data", Map.of("eventId", eventId, "updatedAt", updatedAt)
            );
            kafkaTemplate.send("event-updates", payload);
            log.info("Event update notification sent to user {} for event {}", userId, eventId);
        }
    }

    @Override
    public void sendEventCancellationNotifications(String eventId, String eventName, List<String> userIds, String reason, String cancelledBy) {
        for (String userId : userIds) {
            Map<String, Object> payload = Map.of(
                    "userId", userId,
                    "title", "Event Cancelled",
                    "body", "The event '" + eventName + "' has been cancelled.",
                    "clickAction", "/events/" + eventId,
                    "icon", "https://example.com/event-cancel-icon.png",
                    "data", Map.of("eventId", eventId, "reason", reason, "cancelledBy", cancelledBy)
            );
            kafkaTemplate.send("event-updates", payload);
            log.info("Cancellation notification sent to user {} for event {}", userId, eventId);
        }
    }

    @Override
    public void notifyParticipantsOfNewJoiner(String eventId, String eventName, List<String> previousParticipantIds, String newUserId) {
        for (String receiverId : previousParticipantIds) {
            Map<String, Object> payload = Map.of(
                    "userId", receiverId,
                    "title", "New Player Joined",
                    "body", "A new player has joined the event '" + eventName + "'.",
                    "clickAction", "/events/" + eventId,
                    "icon", "https://example.com/user-join-icon.png",
                    "data", Map.of("eventId", eventId, "newUserId", newUserId)
            );
            kafkaTemplate.send("event-updates", payload);
            log.info("Join notification sent to {} about new participant {} for event {}", receiverId, newUserId, eventId);
        }
    }
}
