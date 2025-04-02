package app.sportahub.eventservice.service.kafka.producer;

import app.sportahub.kafka.events.notification.NotificationEvent;

import java.util.List;
import java.util.Map;

public interface OrchestrationServiceProducer {
    void sendNotificationEvent(NotificationEvent event);
}
