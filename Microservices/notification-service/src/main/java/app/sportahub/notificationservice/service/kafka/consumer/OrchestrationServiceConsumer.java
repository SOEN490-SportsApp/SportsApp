package app.sportahub.notificationservice.service.kafka.consumer;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;

public interface OrchestrationServiceConsumer {

    void consumeEventNotification(NotificationRequest request);

    void consumeFriendRequestNotification(NotificationRequest request);

    void consumeUserMentionNotification(NotificationRequest request);

    void consumeBadgeAssignmentNotification(NotificationRequest request);
}
