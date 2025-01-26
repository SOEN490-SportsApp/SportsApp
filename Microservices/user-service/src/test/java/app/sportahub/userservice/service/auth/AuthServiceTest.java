package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.auth.LoginRequest;
import app.sportahub.userservice.dto.request.auth.RefreshTokenRequest;
import app.sportahub.userservice.dto.request.auth.RegistrationRequest;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.exception.user.*;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private KeycloakApiClient keycloakApiClient;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private @NotNull String createMockJwtToken() {
        String header = Base64.getUrlEncoder().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());
        String payload = Base64.getUrlEncoder().encodeToString("{\"sub\":\"user1\",\"email_verified\":true}".getBytes());
        String signature = "signature";
        return header + "." + payload + "." + signature;
    }

    @Test
    void registerUserSuccessful() {
        RegistrationRequest request = new RegistrationRequest("email@example.com", "username", "password");
        JsonNode responseNode = objectMapper.createObjectNode().put("keycloakId", "keycloakId");
        User savedUser = User.builder()
                .withId("1")
                .withKeycloakId("keycloakId")
                .withEmail("email@example.com")
                .withUsername("username")
                .build();

        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.findUserByUsername(anyString())).thenReturn(Optional.empty());

        when(keycloakApiClient.createUserAndReturnCreatedId(any())).thenReturn(Mono.just(responseNode));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(userMapper.userToUserResponse(any(User.class))).thenReturn(new UserResponse("1", "keycloakId", "email@example.com", "username", null, null, null));
        when(keycloakApiClient.sendVerificationEmail(anyString())).thenReturn(Mono.empty());

        UserResponse result = authService.registerUser(request);
        assertEquals("email@example.com", result.email());
    }


    @Test
    void registerUserEmailExists() {
        RegistrationRequest request = new RegistrationRequest("email@example.com", "username", "password");
        when(userRepository.findUserByEmail("email@example.com"))
                .thenReturn(Optional.of(new User()));

        assertThrows(UserEmailAlreadyExistsException.class, () -> {
            authService.registerUser(request);
        });
    }

    @Test
    void registerUserUsernameExists() {
        RegistrationRequest request = new RegistrationRequest("email@example.com", "username", "password");
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.findUserByUsername("username")).thenReturn(Optional.of(new User()));

        assertThrows(UsernameAlreadyExistsException.class, () -> {
            authService.registerUser(request);
        });
    }

    @Test
    void registerUserKeycloakError() {
        RegistrationRequest request = new RegistrationRequest("email@example.com", "username", "password");
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.findUserByUsername(anyString())).thenReturn(Optional.empty());
        when(keycloakApiClient.createUserAndReturnCreatedId(any()))
                .thenReturn(Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Keycloak error")));

        assertThrows(ResponseStatusException.class, () -> {
            authService.registerUser(request);
        });
    }

    @Test
    void loginUserSuccessful() {
        LoginRequest request = new LoginRequest("email@example.com", "password");
        User foundUser = User.builder()
                .withId("1")
                .withKeycloakId("keycloakId")
                .withEmail("email@example.com")
                .withUsername("username")
                .build();

        when(userRepository.findUserByEmail("email@example.com")).thenReturn(Optional.of(foundUser));

        String mockAccessToken = createMockJwtToken();
        ObjectNode tokenNode = objectMapper.createObjectNode();
        tokenNode.put("access_token", mockAccessToken);
        tokenNode.put("refresh_token", "refreshToken");
        when(keycloakApiClient.login(anyString(), anyString())).thenReturn(Mono.just(tokenNode));

        LoginResponse response = authService.loginUser(request);
        assertNotNull(response);
        assertEquals("1", response.userID());
    }

    @Test
    void loginUserFailure() {
        LoginRequest request = new LoginRequest("username", "password");
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.findUserByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.loginUser(request));
    }

    @Test
    void refreshTokenSuccessful() {
        RefreshTokenRequest request = new RefreshTokenRequest("oldRefreshToken");

        String newAccessToken = createMockJwtToken();
        ObjectNode tokenNode = objectMapper.createObjectNode();
        tokenNode.put("access_token", newAccessToken);
        tokenNode.put("refresh_token", "newRefreshToken");
        when(keycloakApiClient.refreshToken(anyString())).thenReturn(Mono.just(tokenNode));

        TokenResponse response = authService.refreshToken(request);
        assertNotNull(response);
        assertEquals(newAccessToken, response.accessToken());
    }



    @Test
    void refreshTokenFailure() {
        RefreshTokenRequest request = new RefreshTokenRequest("oldRefreshToken");
        when(keycloakApiClient.refreshToken(anyString())).thenReturn(Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST)));

        assertThrows(ResponseStatusException.class, () -> authService.refreshToken(request));
    }

    @Test
    void sendVerificationEmailSuccessful() {
        User user = User.builder().withEmail("email@example.com").withKeycloakId("keycloakId").build();
        when(userRepository.findUserByEmail("email@example.com")).thenReturn(Optional.of(user));
        when(keycloakApiClient.sendVerificationEmail("keycloakId")).thenReturn(Mono.empty());

        assertDoesNotThrow(() -> authService.sendVerificationEmail("email@example.com"));
    }

    @Test
    void sendVerificationEmailNotFound() {
        when(userRepository.findUserByEmail("email@example.com")).thenReturn(Optional.empty());

        assertThrows(UserDoesNotExistException.class, () -> authService.sendVerificationEmail("email@example.com"));
    }

    @Test
    void sendPasswordResetEmailSuccessful() {
        User user = User.builder().withEmail("email@example.com").withKeycloakId("keycloakId").build();
        when(userRepository.findUserByEmail("email@example.com")).thenReturn(Optional.of(user));
        when(keycloakApiClient.sendPasswordResetEmail("keycloakId")).thenReturn(Mono.empty());

        assertDoesNotThrow(() -> authService.sendPasswordResetEmail("email@example.com"));
    }

    @Test
    void sendPasswordResetEmailNotFound() {
        when(userRepository.findUserByEmail("email@example.com")).thenReturn(Optional.empty());

        assertThrows(UserWithEmailDoesNotExistException.class, () -> authService.sendPasswordResetEmail("email@example.com"));
    }

}
