package app.sportahub.notificationservice.util;

import com.google.firebase.messaging.*;

import java.util.List;
import java.util.Map;

/**
 * Utility class for building Firebase Cloud Messaging notification objects.
 * This class provides methods to create properly structured notification messages
 * for both single devices and multiple devices.
 */
public class FirebaseNotificationBuilder {
    /**
     * Builds a multicast message for sending to multiple FCM tokens
     *
     * @param tokens      List of FCM tokens to send to
     * @param title       Notification title
     * @param body        Notification body
     * @param clickAction Action to take when notification is clicked
     * @param icon        Icon to display with the notification (resource name or URL)
     * @param data        Additional data payload as Map<String, String>
     * @return MulticastMessage object ready to be sent
     */
    public static MulticastMessage buildNotificationMessage(
            List<String> tokens, String title, String body, String clickAction,
            String icon, Map<String, String> data) {

        Notification notification = buildNotification(title, body);

        AndroidConfig androidConfig = buildAndroidConfig(clickAction, icon);

        ApnsConfig apnsConfig = buildApnsConfig(clickAction);

        MulticastMessage.Builder messageBuilder = MulticastMessage.builder()
                .setNotification(notification)
                .setAndroidConfig(androidConfig)
                .setApnsConfig(apnsConfig)
                .addAllTokens(tokens);

        // Add data payload if provided and not empty
        if (data != null && !data.isEmpty()) {
            messageBuilder.putAllData(data);
        }

        return messageBuilder.build();
    }

    /**
     * Overloaded method for sending to multiple FCM tokens without specifying an icon
     *
     * @param tokens      List of FCM tokens to send to
     * @param title       Notification title
     * @param body        Notification body
     * @param clickAction Action to take when notification is clicked
     * @param data        Additional data payload as Map<String, String>
     * @return MulticastMessage object ready to be sent
     */
    public static MulticastMessage buildNotificationMessage(
            List<String> tokens, String title, String body,
            String clickAction, Map<String, String> data) {
        return buildNotificationMessage(tokens, title, body, clickAction, null, data);
    }

    /**
     * Builds a message for sending to a single FCM token
     *
     * @param token       FCM token to send to
     * @param title       Notification title
     * @param body        Notification body
     * @param clickAction Action to take when notification is clicked
     * @param icon        Icon to display with the notification (resource name or URL)
     * @param data        Additional data payload as Map<String, String>
     * @return Message object ready to be sent
     */
    public static Message buildSingleNotificationMessage(
            String token, String title, String body, String clickAction,
            String icon, Map<String, String> data) {

        Notification notification = buildNotification(title, body);

        AndroidConfig androidConfig = buildAndroidConfig(clickAction, icon);

        ApnsConfig apnsConfig = buildApnsConfig(clickAction);

        Message.Builder messageBuilder = Message.builder()
                .setNotification(notification)
                .setAndroidConfig(androidConfig)
                .setApnsConfig(apnsConfig)
                .setToken(token);

        if (data != null && !data.isEmpty()) {
            messageBuilder.putAllData(data);
        }

        return messageBuilder.build();
    }

    /**
     * Overloaded method for sending to a single FCM token without specifying an icon
     *
     * @param token       FCM token to send to
     * @param title       Notification title
     * @param body        Notification body
     * @param clickAction Action to take when notification is clicked
     * @param data        Additional data payload as Map<String, String>
     * @return Message object ready to be sent
     */
    public static Message buildSingleNotificationMessage(
            String token, String title, String body,
            String clickAction, Map<String, String> data) {
        return buildSingleNotificationMessage(token, title, body, clickAction, null, data);
    }

    /**
     * Builds a notification object with the specified title and body
     *
     * @param title The title of the notification
     * @param body  The body text of the notification
     * @return Notification object configured with the provided title and body
     */
    private static Notification buildNotification(String title, String body) {
        return Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();
    }

    /**
     * Builds Android-specific notification configuration
     *
     * @param clickAction The action to perform when the notification is clicked
     * @param icon        The icon to display with the notification (can be null)
     * @return AndroidConfig object with the appropriate settings
     */
    private static AndroidConfig buildAndroidConfig(String clickAction, String icon) {
        AndroidNotification.Builder notificationBuilder = AndroidNotification.builder()
                .setClickAction(clickAction);

        if (icon != null && !icon.isEmpty()) {
            notificationBuilder.setIcon(icon);
        }

        return AndroidConfig.builder()
                .setNotification(notificationBuilder.build())
                .setPriority(AndroidConfig.Priority.HIGH)
                .build();
    }

    /**
     * Builds Apple Push Notification service (APNs) specific configuration
     *
     * @param clickAction The category identifier for the notification on iOS
     * @return ApnsConfig object with the appropriate settings
     */
    private static ApnsConfig buildApnsConfig(String clickAction) {
        return ApnsConfig.builder()
                .setAps(Aps.builder()
                        .setCategory(clickAction)
                        .setSound("default")
                        .setMutableContent(true)
                        .build())
                .build();
    }
}
