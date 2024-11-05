package app.sportahub.userservice.service.user;

import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.model.user.User;

public interface UserService {

    User createUser(UserRequest userRequest);

    User getUserById(String id);
}
