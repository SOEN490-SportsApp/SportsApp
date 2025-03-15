package app.sportahub.notificationservice.dto.request.notification;

import java.util.Map;

public record NotificationRequest(String userId, String title, String body, String clickAction, String icon,
                                  Map<String, String> data) {
}
