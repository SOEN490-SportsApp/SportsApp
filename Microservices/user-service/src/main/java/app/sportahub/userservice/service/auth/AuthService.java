package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.dto.request.auth.LoginRequest;
import app.sportahub.userservice.dto.request.auth.RefreshTokenRequest;
import app.sportahub.userservice.dto.request.auth.RegistrationRequest;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;

import org.springframework.http.ResponseEntity;

public interface AuthService {

    UserResponse registerUser(RegistrationRequest userRequest);

    LoginResponse loginUser(LoginRequest loginRequest);

    TokenResponse refreshToken(RefreshTokenRequest tokenRequest);

    void sendVerificationEmail(String userId);
}
