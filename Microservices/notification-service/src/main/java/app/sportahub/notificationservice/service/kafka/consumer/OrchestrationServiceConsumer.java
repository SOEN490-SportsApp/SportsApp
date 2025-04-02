package app.sportahub.notificationservice.service.kafka.consumer;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.notification.NotificationEvent;

public interface OrchestrationServiceConsumer {

    void listenForNotificationEvent(NotificationEvent event);

}
