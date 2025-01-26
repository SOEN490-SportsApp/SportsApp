package app.sportahub.userservice.controller;

import app.sportahub.userservice.config.auth.TestSecurityConfig;
import app.sportahub.userservice.controller.auth.AuthController;
import app.sportahub.userservice.dto.request.auth.*;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.exception.user.InvalidCredentialsException;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UserWithEmailDoesNotExistException;
import app.sportahub.userservice.service.auth.AuthServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("user-service.test")
@WebMvcTest(AuthController.class)
@Import({TestSecurityConfig.class, AuthServiceImpl.class})
@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    private AuthServiceImpl authService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequest validLoginRequest;
    private LoginResponse loginResponse;
    private SendVerificationEmailRequest sendVerificationEmailRequest;
    private SendPasswordResetEmailRequest sendPasswordResetEmailRequest;

    @SneakyThrows
    @BeforeEach
    public void setUp() {
        validLoginRequest = new LoginRequest("danDuguay", "mypassword");
        sendVerificationEmailRequest = new SendVerificationEmailRequest("test@gmail.com");
        TokenResponse tokenResponse = new TokenResponse("accessTokenResponse", "refreshTokenResponse", false);
        loginResponse = new LoginResponse("userIDResponse", tokenResponse);
        sendPasswordResetEmailRequest = new SendPasswordResetEmailRequest("test@gmail.com");

        when(authService.loginUser(any())).thenReturn(loginResponse);
    }

    @SneakyThrows
    @Test
    public void shouldLoginUserSuccessfully() {
        Assertions.assertEquals(loginResponse, authService.loginUser(validLoginRequest));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.userID").value(loginResponse.userID()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenResponse.accessToken").value(loginResponse.tokenResponse().accessToken()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenResponse.refreshToken").value(loginResponse.tokenResponse().refreshToken()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenResponse.emailVerified").value(loginResponse.tokenResponse().emailVerified()));
    }

    @SneakyThrows
    @Test
    public void loginWithNonExistentUserShouldFail() {
        when(authService.loginUser(any())).thenThrow(new UserDoesNotExistException("nonexistent@user.com"));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("nonexistent@user.com", "password"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User with identifier: nonexistent@user.com does not exist."));
    }



    @SneakyThrows
    @Test
    public void shouldSendVerificationEmailSuccessfully() {
        mockMvc.perform(MockMvcRequestBuilders.put("/auth/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendVerificationEmailRequest)))
                .andExpect(status().isOk());
    }

    @SneakyThrows
    @Test
    public void sendVerificationEmailToNonExistentUserShouldFail() {
        SendVerificationEmailRequest request = new SendVerificationEmailRequest("nonexistent@example.com");
        doThrow(new UserWithEmailDoesNotExistException("nonexistent@example.com"))
                .when(authService).sendVerificationEmail(any());

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @SneakyThrows
    @Test
    public void shouldReturnInternalServerErrorOnUnexpectedException() {

        doThrow(new UserDoesNotExistException(sendVerificationEmailRequest.email()))
                .when(authService).sendVerificationEmail(sendVerificationEmailRequest.email());

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendVerificationEmailRequest)))
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("User with identifier: " + sendVerificationEmailRequest.email() + " does not exist."));
    }
    @SneakyThrows
    @Test
    public void shouldSendPasswordResetEmailSuccessfully() {
        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendPasswordResetEmailRequest)))
                .andExpect(status().isOk());
    }

    @SneakyThrows
    @Test
    public void sendPasswordResetEmailServerErrorShouldReturnInternalServerError() {
        doThrow(new RuntimeException("Unexpected error"))
                .when(authService).sendPasswordResetEmail(any());

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SendPasswordResetEmailRequest("valid@example.com"))))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("An unexpected error occurred: Unexpected error"));
    }

    @SneakyThrows
    @Test
    public void shouldReturnNotFoundForNonExistentUser() {
        SendPasswordResetEmailRequest nonexistentEmailRequest = new SendPasswordResetEmailRequest("nonexistent@gmail.com");

        doThrow(new UserWithEmailDoesNotExistException(nonexistentEmailRequest.email()))
                .when(authService).sendPasswordResetEmail(nonexistentEmailRequest.email());
        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nonexistentEmailRequest)))
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error")
                        .value("User with email: nonexistent@gmail.com does not exist."));
    }

    @SneakyThrows
    @Test
    public void shouldReturnBadRequestForInvalidEmailFormat() {
        SendPasswordResetEmailRequest invalidEmailRequest = new SendPasswordResetEmailRequest("invalid-email");

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEmailRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.errors.email")
                        .value("must be a well-formed email address"));
    }

    @SneakyThrows
    @Test
    public void shouldReturnBadRequestForEmptyEmail() {
        SendPasswordResetEmailRequest emptyEmailRequest = new SendPasswordResetEmailRequest("");

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyEmailRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.errors.email")
                        .value("must not be empty"));
    }

    @SneakyThrows
    @Test
    public void shouldSendPasswordResetEmailForCaseInsensitiveEmail() {
        SendPasswordResetEmailRequest caseInsensitiveRequest = new SendPasswordResetEmailRequest("Test@GMAIL.com");

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(caseInsensitiveRequest)))
                .andExpect(status().isOk());
    }

    @SneakyThrows
    @Test
    public void shouldRegisterUserSuccessfully() {
        RegistrationRequest request = new RegistrationRequest("user@example.com", "username", "password");
        UserResponse expectedResponse = new UserResponse("1", "keycloakId", "user@example.com", "username", null, null, null);
        when(authService.registerUser(any())).thenReturn(expectedResponse);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @SneakyThrows
    @Test
    public void registerWithExistingEmailShouldFail() {
        RegistrationRequest request = new RegistrationRequest("user@example.com", "username", "password");
        when(authService.registerUser(any())).thenThrow(new UserEmailAlreadyExistsException("user@example.com"));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @SneakyThrows
    @Test
    public void shouldRefreshTokenSuccessfully() {
        RefreshTokenRequest request = new RefreshTokenRequest("validRefreshToken");
        TokenResponse response = new TokenResponse("newAccessToken", "newRefreshToken", true);
        when(authService.refreshToken(any())).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"));
    }

    @SneakyThrows
    @Test
    public void refreshTokenWithInvalidTokenShouldFail() {
        RefreshTokenRequest request = new RefreshTokenRequest("invalidToken");
        when(authService.refreshToken(any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
