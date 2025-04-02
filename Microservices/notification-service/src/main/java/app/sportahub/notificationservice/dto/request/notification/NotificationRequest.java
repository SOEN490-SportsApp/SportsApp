package app.sportahub.notificationservice.dto.request.notification;

import com.mongodb.lang.Nullable;
import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record NotificationRequest(@NotBlank
                                  String userId,

                                  @NotBlank
                                  String messageTitle,

                                  @NotBlank
                                  String messageBody,

                                  @Nullable
                                  Map<String, String> data,

                                  @NotBlank
                                  String clickAction,

                                  @Nullable
                                  String icon,

                                  @Nullable
                                  String messageSubtitle,

                                  @Nullable
                                  Integer badgeCount,

                                  @Nullable
                                  Boolean playSound) {
}
