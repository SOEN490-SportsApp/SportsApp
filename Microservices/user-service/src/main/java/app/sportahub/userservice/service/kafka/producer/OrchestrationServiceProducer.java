package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.kafka.events.notification.NotificationEvent;

import java.util.List;

public interface OrchestrationServiceProducer {

    void sendPasswordResetEmailUsingKafka(String email);
    List<String> getEventsJoinedByUser(String userId);
    void sendNotificationEvent(NotificationEvent event);
}
