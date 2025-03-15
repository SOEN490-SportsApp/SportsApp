package app.sportahub.notificationservice.service.notification;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.dto.response.notification.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void processNotification(NotificationRequest notificationRequest);

    Page<NotificationResponse> getNotificationsByUserId(String userId, Pageable pageable);

    NotificationResponse markNotificationAsRead(String notificationId);
}
