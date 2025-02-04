package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.Profile;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserProfileResponse(String userId, ProfileResponse profileResponse) {
}