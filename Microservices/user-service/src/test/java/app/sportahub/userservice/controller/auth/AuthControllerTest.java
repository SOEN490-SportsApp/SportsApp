package app.sportahub.userservice.controller.auth;

import app.sportahub.userservice.dto.request.auth.*;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.service.auth.AuthService;
import app.sportahub.userservice.service.kafka.producer.OrchestrationServiceProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private OrchestrationServiceProducer orchestrationServiceProducer;

    @InjectMocks
    private AuthController authController;

    private RegistrationRequest registrationRequest;
    private LoginRequest loginRequest;
    private RefreshTokenRequest refreshTokenRequest;
    private SendVerificationEmailRequest sendVerificationEmailRequest;
    private SendPasswordResetEmailRequest sendPasswordResetEmailRequest;

    @BeforeEach
    void setUp() {
        registrationRequest = new RegistrationRequest("testuser", "test@example.com", "password123");
        loginRequest = new LoginRequest("test@example.com", "password123");
        refreshTokenRequest = new RefreshTokenRequest("refresh-token");
        sendVerificationEmailRequest = new SendVerificationEmailRequest("test@example.com");
        sendPasswordResetEmailRequest = new SendPasswordResetEmailRequest("test@example.com");
    }

    @Test
    void registerUserShouldRunWithoutExceptions() {
        when(authService.registerUser(registrationRequest)).thenReturn(mock(UserResponse.class));
        authController.registerUser(registrationRequest);
        verify(authService).registerUser(registrationRequest);
    }

    @Test
    void loginUserShouldRunWithoutExceptions() {
        when(authService.loginUser(loginRequest)).thenReturn(mock(LoginResponse.class));
        authController.loginUser(loginRequest);
        verify(authService).loginUser(loginRequest);
    }

    @Test
    void refreshTokenShouldRunWithoutExceptions() {
        when(authService.refreshToken(refreshTokenRequest)).thenReturn(mock(TokenResponse.class));
        authController.refreshToken(refreshTokenRequest);
        verify(authService).refreshToken(refreshTokenRequest);
    }

    @Test
    void sendVerificationEmailShouldRunWithoutExceptions() {
        authController.sendVerificationEmail(sendVerificationEmailRequest);
        verify(authService).sendVerificationEmail(sendVerificationEmailRequest.email());
    }

    @Test
    void sendPasswordResetEmailShouldRunWithoutExceptions() {
        authController.sendPasswordResetEmail(sendPasswordResetEmailRequest);
        verify(authService).sendPasswordResetEmail(sendPasswordResetEmailRequest.email());
        verify(orchestrationServiceProducer).sendPasswordResetEmailUsingKafka(sendPasswordResetEmailRequest.email());
    }
}
