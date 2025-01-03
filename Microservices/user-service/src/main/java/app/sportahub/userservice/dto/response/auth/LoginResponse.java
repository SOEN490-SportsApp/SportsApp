package app.sportahub.userservice.dto.response.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotEmpty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginResponse(@NotEmpty String userID, @NotEmpty TokenResponse tokenResponse) {
}
//hi
