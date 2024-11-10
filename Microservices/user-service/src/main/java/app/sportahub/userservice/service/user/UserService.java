package app.sportahub.userservice.service.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;

public interface UserService {

    User getUserById(String id);

    User createUser(UserRequest userRequest);

    Profile updateUserProfile(String id, ProfileRequest profileRequest);

    Profile patchUserProfile(String id, ProfileRequest profileRequest);
}
