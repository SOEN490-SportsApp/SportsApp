package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.Friend;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(String id, String keycloakId, String email, String username, ProfileResponse profile,
                           PreferencesResponse preferences, List<Friend> friendList) {
}
