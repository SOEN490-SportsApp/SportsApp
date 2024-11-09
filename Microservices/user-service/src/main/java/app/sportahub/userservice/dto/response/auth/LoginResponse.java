package app.sportahub.userservice.dto.response.auth;

import jakarta.validation.constraints.NotEmpty;

public record LoginResponse(@NotEmpty String userID, @NotEmpty TokenResponse tokenResponse) {
}
