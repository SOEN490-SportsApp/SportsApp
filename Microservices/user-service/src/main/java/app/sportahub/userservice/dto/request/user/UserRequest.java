package app.sportahub.userservice.dto.request.user;

import app.sportahub.userservice.model.user.Friend;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserRequest(String keycloakId,

                          @NotBlank(message = "Valid email is required")
                          @Email(message = "Valid email is required")
                          String email,

                          @NotBlank(message = "Username must be provided")
                          String username,

                          @NotBlank(message = "Password must be provided")
                          String password,

                          @Nullable
                          ProfileRequest profile,

                          @Nullable
                          PreferencesRequest preferences,

                          @Nullable
                          List<Friend> friendList) {
}
