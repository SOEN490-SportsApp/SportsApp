package app.sportahub.userservice.dto.response.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TokenResponse(@NotEmpty String accessToken, @NotEmpty String refreshToken,
                            @NotNull Boolean emailVerified) {
}
