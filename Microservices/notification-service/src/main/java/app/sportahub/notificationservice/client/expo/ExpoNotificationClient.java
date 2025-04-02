package app.sportahub.notificationservice.client.expo;

import com.niamedtech.expo.exposerversdk.ExpoPushNotificationClient;
import com.niamedtech.expo.exposerversdk.request.PushNotification;
import com.niamedtech.expo.exposerversdk.response.TicketResponse;
import lombok.SneakyThrows;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ExpoNotificationClient {
    private final ExpoPushNotificationClient client;

    public ExpoNotificationClient() {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        this.client = ExpoPushNotificationClient.builder()
                .setHttpClient(httpClient)
                .build();
    }

    /**
     * Sends a push notification to a list of devices.
     *
     * @param pushTokens      List of device push tokens to send the notification to.
     * @param messageTitle    Title of the notification message.
     * @param messageBody     Body of the notification message.
     * @param data            Additional data to include in the notification.
     * @param messageSubtitle Subtitle of the notification message (Apple only).
     * @param badgeCount      Badge count to display on the app icon (Apple only).
     * @param playSound       Whether to play a sound when the notification is received (Apple only).
     * @return List of NotificationResponse objects containing the response from the push notification service.
     */
    @SneakyThrows
    public List<ExpoNotificationResponse> sendPushNotification(List<String> pushTokens, String messageTitle,
                                                               String messageBody, Map<String, String> data,
                                                               String messageSubtitle, Integer badgeCount,
                                                               Boolean playSound) {
        PushNotification pushNotification = new PushNotification();

        pushNotification.setTo(pushTokens);
        pushNotification.setTitle(messageTitle);
        pushNotification.setBody(messageBody);
        pushNotification.setData(new HashMap<>(data));

        // Apple Only
        pushNotification.setSubtitle(messageSubtitle);
        pushNotification.setBadge(badgeCount != null ? badgeCount.longValue() : null);
        pushNotification.setSound(playSound != null && playSound ? "default" : null);

        List<PushNotification> notifications = List.of(pushNotification);
        List<TicketResponse.Ticket> response = client.sendPushNotifications(notifications);

        return response.parallelStream()
                .map(n -> new ExpoNotificationResponse(n.getId(), n.getStatus().toString(), n.getMessage())).toList();
    }
}
