package app.sportahub.notificationservice.dto.request.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;

import java.util.Map;

public record NotificationRequest(@NotBlank
                                  String userId,

                                  @NotBlank
                                  String title,

                                  @NotBlank
                                  String body,

                                  @NotBlank
                                  String clickAction,

                                  @Null
                                  String icon,

                                  Map<String, String> data) {
}
