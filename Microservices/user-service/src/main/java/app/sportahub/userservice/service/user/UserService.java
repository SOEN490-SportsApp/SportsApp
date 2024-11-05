package app.sportahub.userservice.service.user;

import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.dto.request.user.UserRequest;

public interface UserService {

    User createUser(UserRequest userRequest);

    User getUserById(String id);
}
