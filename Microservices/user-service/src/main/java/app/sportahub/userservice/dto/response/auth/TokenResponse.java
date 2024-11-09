package app.sportahub.userservice.dto.response.auth;

import jakarta.validation.constraints.NotEmpty;

public record TokenResponse(@NotEmpty String accessToken, @NotEmpty String refreshToken) {
}
