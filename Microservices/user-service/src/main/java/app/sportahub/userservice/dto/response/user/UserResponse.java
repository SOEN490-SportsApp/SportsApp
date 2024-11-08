package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(String id, String keycloakId, String email, String username, ProfileResponse profile,
                           PreferencesResponse preferences) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getKeycloakId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfile() != null ? ProfileResponse.from(user.getProfile()) : null,
                user.getPreferences() != null ? PreferencesResponse.from(user.getPreferences()) : null);
    }
}
