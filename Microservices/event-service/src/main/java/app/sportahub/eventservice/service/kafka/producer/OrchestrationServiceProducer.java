package app.sportahub.eventservice.service.kafka.producer;

import java.util.List;

public interface OrchestrationServiceProducer {
    void sendEventUpdateNotifications(String eventId, String eventName, List<String> userIds, String updatedAt);
    void sendEventCancellationNotifications(String eventId, String eventName, List<String> userIds, String reason, String cancelledBy);
    void notifyParticipantsOfNewJoiner(String eventId, String eventName, List<String> previousParticipantIds, String newUserId);
}
