package app.sportahub.notificationservice.service;

import app.sportahub.notificationservice.model.notification.Notification;
import app.sportahub.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate; // For WebSocket communication

    @Override
    @KafkaListener(topics = "notifications", groupId = "notification-service")
    public void sendNotification(String userId, String message, String type) {
        // Create a new Notification object
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .isRead(false)
                .creationDate(Timestamp.valueOf(LocalDateTime.now()))
                .updatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        // Save the notification in the database
        notificationRepository.save(notification);

        // Send the notification via WebSocket
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }

    @Override
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getUnreadNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }

    @Override
    public void markNotificationAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notification.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
            notificationRepository.save(notification);
        });
    }
}