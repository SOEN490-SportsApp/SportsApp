package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.dto.request.auth.RegistrationRequest;
import app.sportahub.userservice.model.user.User;

public interface AuthService {

    User registerUser(RegistrationRequest userRequest);
}
