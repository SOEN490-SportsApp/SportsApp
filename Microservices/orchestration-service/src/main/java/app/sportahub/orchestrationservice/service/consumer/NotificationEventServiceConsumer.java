package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafka.events.notification.NotificationEvent;

public interface NotificationEventServiceConsumer {
    void listenForNotificationEvent(NotificationEvent event);
}
