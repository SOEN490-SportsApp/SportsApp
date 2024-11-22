package app.sportahub.userservice.service.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;

public interface UserService {

    UserResponse getUserById(String id);

    UserResponse createUser(UserRequest userRequest);

    ProfileResponse updateUserProfile(String id, ProfileRequest profileRequest);

    ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest);
}
