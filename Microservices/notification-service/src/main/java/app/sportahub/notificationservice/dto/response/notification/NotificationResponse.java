package app.sportahub.notificationservice.dto.response.notification;

import java.util.Map;

public record NotificationResponse(String id, String userId, String title, String message, String clickAction,
                                   String icon, Map<String, String> data, boolean isRead) {
}
