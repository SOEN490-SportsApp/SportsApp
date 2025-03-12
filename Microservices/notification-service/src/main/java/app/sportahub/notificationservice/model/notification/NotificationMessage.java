package app.sportahub.notificationservice.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private String userId; // The user who will receive the notification
    private String message;
    private String type; // The type of notification (e.g., EVENT_CANCELLED, FRIEND_REQUEST_RECEIVED)
}