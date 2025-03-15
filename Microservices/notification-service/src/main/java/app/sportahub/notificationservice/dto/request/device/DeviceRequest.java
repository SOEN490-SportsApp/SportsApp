package app.sportahub.notificationservice.dto.request.device;

import jakarta.validation.constraints.NotBlank;

public record DeviceRequest(@NotBlank String deviceToken) {
}
