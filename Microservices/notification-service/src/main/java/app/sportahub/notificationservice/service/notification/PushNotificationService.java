package app.sportahub.notificationservice.service.notification;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import lombok.SneakyThrows;

public interface PushNotificationService {

    @SneakyThrows
    void sendExpoPushNotificationToUser(NotificationRequest notificationRequest);
}
