package app.sportahub.eventservice.service.kafka.producer;

import app.sportahub.kafka.events.notification.NotificationEvent;


public interface OrchestrationServiceProducer {
    void sendNotificationEvent(NotificationEvent event);
    String getUserById(String userId);
}