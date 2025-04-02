package app.sportahub.notificationservice.service.notification;

import app.sportahub.notificationservice.client.expo.ExpoNotificationClient;
import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.model.device.Device;
import app.sportahub.notificationservice.service.device.DeviceService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationServiceImpl implements PushNotificationService {

    private final DeviceService deviceService;

    private final ExpoNotificationClient expoNotificationClient;

    /**
     * Sends a push notification to a user based on the provided notification request.
     *
     * @param notificationRequest The notification request containing the user ID, message details, and additional data.
     */
    @SneakyThrows
    @Override
    public void sendExpoPushNotificationToUser(NotificationRequest notificationRequest) {
        String userId = notificationRequest.userId();

        List<Device> devices = deviceService.getDevicesByUserId(userId);
        List<String> deviceTokens = devices.stream().map(Device::getDeviceToken).toList();

        // Include clickAction in the data map, along with icon if present
        Map<String, String> data = new HashMap<>(
                notificationRequest.data() != null
                        ? notificationRequest.data() : Map.of());
        data.put("clickAction", notificationRequest.clickAction());
        if (notificationRequest.icon() != null) {
            data.put("icon", notificationRequest.icon());
        }

        expoNotificationClient.sendPushNotification(deviceTokens,
                notificationRequest.messageTitle(),
                notificationRequest.messageBody(),
                data,
                notificationRequest.messageSubtitle(),
                notificationRequest.badgeCount(),
                notificationRequest.playSound()
        ).forEach(notification -> {
            log.info("ExpoNotificationClient::sendNotificationToUser: Sent notification to user {}: id: {}, status: {}, message: {}",
                    userId, notification.id(), notification.status(), notification.message());
        });
    }
}
