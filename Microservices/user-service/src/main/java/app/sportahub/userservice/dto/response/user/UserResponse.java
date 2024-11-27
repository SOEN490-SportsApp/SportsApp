package app.sportahub.userservice.dto.response.user;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(String id, String keycloakId, String email, String username, ProfileResponse profile,
                           PreferencesResponse preferences) {
}
