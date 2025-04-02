package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafka.events.notification.NotificationEvent;

public interface NotificationServiceProducer {
    void sendNotification(NotificationEvent event);
}
