package app.sportahub.notificationservice.service;

import app.sportahub.notificationservice.model.notification.Notification;

import java.util.List;

public interface NotificationService {

    void sendNotification(String userId, String message, String type);

    List<Notification> getNotificationsByUserId(String userId);

    List<Notification> getUnreadNotificationsByUserId(String userId);

    void markNotificationAsRead(String notificationId);
}