package app.sportahub.notificationservice.dto.response.notification;

import java.util.Map;

public record NotificationResponse(String id, String userId, String messageTitle, String messageBody,
                                   Map<String, String> data, String clickAction, String icon,
                                   String messageSubtitle, Integer badgeCount, Boolean playSound, boolean isRead) {
}
