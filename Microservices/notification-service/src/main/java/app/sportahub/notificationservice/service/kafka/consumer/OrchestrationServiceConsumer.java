package app.sportahub.notificationservice.service.kafka.consumer;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;

public interface OrchestrationServiceConsumer {

    void consumeNotification(NotificationRequest request);

}
