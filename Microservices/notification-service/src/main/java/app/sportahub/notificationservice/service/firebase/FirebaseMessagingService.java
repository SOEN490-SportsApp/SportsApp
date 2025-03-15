package app.sportahub.notificationservice.service.firebase;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.exception.notification.NotificationException;
import app.sportahub.notificationservice.model.device.Device;
import app.sportahub.notificationservice.service.device.DeviceService;
import app.sportahub.notificationservice.util.FirebaseNotificationBuilder;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseMessagingService {

    private final DeviceService deviceService;

    private final FirebaseMessaging firebaseMessaging;

    /**
     * Sends a notification to all registered devices of a specific user.
     * <p>
     * This method retrieves all devices associated with the user, builds a notification message,
     * and sends it using Firebase Cloud Messaging (FCM). If the delivery fails for some devices,
     * it handles the failure by checking for invalid tokens.
     * </p>
     *
     * @param notificationRequest the notification request containing user ID, title, body, click action, icon, and data
     * @throws NotificationException if the notification fails to send
     */
    @SneakyThrows
    public void sendNotificationToUser(NotificationRequest notificationRequest) {
        String userId = notificationRequest.userId();

        List<Device> devices = deviceService.getDevicesByUserId(userId);

        List<String> deviceTokens = devices.stream().map(Device::getDeviceToken).toList();

        MulticastMessage message = notificationRequest.icon() != null
                ? FirebaseNotificationBuilder
                .buildNotificationMessage(
                        deviceTokens,
                        notificationRequest.title(),
                        notificationRequest.body(),
                        notificationRequest.clickAction(),
                        notificationRequest.icon(),
                        notificationRequest.data())
                : FirebaseNotificationBuilder.
                buildNotificationMessage(
                        deviceTokens,
                        notificationRequest.title(),
                        notificationRequest.body(),
                        notificationRequest.clickAction(),
                        notificationRequest.data());

        try {
            BatchResponse response = firebaseMessaging.sendEachForMulticast(message);
            log.info("FirebaseMessagingService::sendNotificationToUser: Sent notification to user {}: success count: {}, failure count: {}",
                    userId, response.getSuccessCount(), response.getFailureCount());

            if (response.getFailureCount() > 0) {
                handleFailedDelivery(response, deviceTokens);
            }

        } catch (FirebaseMessagingException e) {
            log.error("FirebaseMessagingService::sendNotificationToUser: Failed to send notification to user {}: {}",
                    userId, e.getMessage(), e);
            throw new NotificationException("Failed to send notification to user: " + userId, e);
        }
    }

    /**
     * Handles failed notification deliveries for multiple devices.
     * <p>
     * This method iterates through the response list and identifies devices that failed to receive the notification.
     * It logs the failed attempts and calls {@link #handleFailedDelivery(String, FirebaseMessagingException)} for each failure.
     * </p>
     *
     * @param response     the batch response containing the status of each notification sent
     * @param deviceTokens the list of device tokens that the notifications were sent to
     */
    private void handleFailedDelivery(BatchResponse response, List<String> deviceTokens) {
        List<SendResponse> responses = response.getResponses();

        for (int i = 0; i < responses.size(); i++) {
            if (!responses.get(i).isSuccessful()) {
                log.error("FirebaseMessagingService::sendNotificationToUser: Failed to send notification to token {}: {}",
                        deviceTokens.get(i), responses.get(i).getException().getMessage());

                handleFailedDelivery(deviceTokens.get(i), responses.get(i).getException());
            }
        }
    }

    /**
     * Handles failed notification delivery for a specific device token.
     * <p>
     * If the failure is due to an unregistered or invalid token, the token is removed from the database
     * to prevent further unnecessary notifications.
     * </p>
     *
     * @param token     the device token that failed to receive the notification
     * @param exception the exception that occurred during delivery
     */
    private void handleFailedDelivery(String token, FirebaseMessagingException exception) {
        if (exception.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED ||
                exception.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
            log.info("Removing invalid token from database: {}", token);
            deviceService.deleteDeviceByDeviceToken(token);
        }
    }

}
