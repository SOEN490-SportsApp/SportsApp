package app.sportahub.notificationservice.service.notification;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.dto.response.notification.NotificationResponse;
import app.sportahub.notificationservice.exception.notification.NotificationNotFoundException;
import app.sportahub.notificationservice.mapper.notification.NotificationMapper;
import app.sportahub.notificationservice.model.notification.Notification;
import app.sportahub.notificationservice.repository.notification.NotificationRepository;
import app.sportahub.notificationservice.service.firebase.FirebaseMessagingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final FirebaseMessagingService firebaseMessagingService;
    private final NotificationMapper notificationMapper;

    /**
     * Processes and saves a new notification.
     * This method maps the request to an entity, saves it in the database,
     * and sends a push notification to the user.
     *
     * @param notificationRequest The notification details from the request.
     */
    @Override
    public void processNotification(NotificationRequest notificationRequest) {
        log.info("NotificationServiceImpl::processNotification: Processing notification for user: {}",
                notificationRequest.userId());

        Notification notification = notificationMapper.toEntity(notificationRequest);
        Notification savedNotification = notificationRepository.save(notification);

        log.info("NotificationServiceImpl::processNotification: Notification saved with ID: {}", savedNotification.getId());

        firebaseMessagingService.sendNotificationToUser(notificationRequest);

        log.info("NotificationServiceImpl::processNotification: Notification sent to user {}: {}",
                notificationRequest.userId(), savedNotification);
    }

    /**
     * Retrieves paginated notifications for a specific user.
     * Fetches notifications from the database and maps them to response DTOs.
     *
     * @param userId   The ID of the user whose notifications are being retrieved.
     * @param pageable Pagination and sorting details.
     * @return A paginated list of notifications as {@link NotificationResponse}.
     */
    @Override
    public Page<NotificationResponse> getNotificationsByUserId(String userId, Pageable pageable) {
        log.info("NotificationServiceImpl::getNotificationsByUserId: Retrieving notifications for user: {}", userId);

        Page<NotificationResponse> notifications = notificationRepository
                .findByUserId(userId, pageable)
                .map(notificationMapper::toResponseDto);

        log.info("NotificationServiceImpl::getNotificationsByUserId: Retrieved {} notifications for user: {}",
                notifications.getTotalElements(), userId);

        return notifications;
    }

    /**
     * Marks a notification as read and updates it in the database.
     *
     * @param notificationId The ID of the notification to mark as read.
     * @return The updated notification as a {@link NotificationResponse}.
     * @throws NotificationNotFoundException If the notification is not found.
     */
    @Override
    public NotificationResponse markNotificationAsRead(String notificationId) {
        log.info("NotificationServiceImpl::markNotificationAsRead: Marking notification as read: {}", notificationId);

        Notification notification = notificationRepository.findById(notificationId)
                .map(n -> n.toBuilder()
                        .withIsRead(true)
                        .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                        .build())
                .orElseThrow(() -> {
                    log.warn("NotificationServiceImpl::markNotificationAsRead: Notification with ID {} not found", notificationId);
                    return new NotificationNotFoundException(notificationId);
                });

        Notification savedNotification = notificationRepository.save(notification);
        log.info("NotificationServiceImpl::markNotificationAsRead: Successfully marked notification {} as read", notificationId);

        return notificationMapper.toResponseDto(savedNotification);
    }
}
