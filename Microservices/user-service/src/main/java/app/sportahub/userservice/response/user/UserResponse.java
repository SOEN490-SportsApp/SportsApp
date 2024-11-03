package app.sportahub.userservice.response.user;

import app.sportahub.userservice.model.user.User;

public record UserResponse(String email, String username, ProfileResponse profile) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getEmail(),
                user.getUsername(),
                user.getProfile() != null ? ProfileResponse.from(user.getProfile()) : null);
    }
}
