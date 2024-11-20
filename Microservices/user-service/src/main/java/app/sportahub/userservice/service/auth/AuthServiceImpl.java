package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.auth.LoginRequest;
import app.sportahub.userservice.dto.request.auth.RefreshTokenRequest;
import app.sportahub.userservice.dto.request.auth.RegistrationRequest;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.exception.user.InvalidCredentialsException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final KeycloakApiClient keycloakApiClient;
    private final UserMapper userMapper;

    @SneakyThrows
    @Override
    public UserResponse registerUser(RegistrationRequest userRequest) {
        userRepository.findUserByEmail(userRequest.email())
                .ifPresent(user -> {
                    throw new UserEmailAlreadyExistsException(userRequest.email());
                });
        userRepository.findUserByUsername(userRequest.username())
                .ifPresent(user -> {
                    throw new UsernameAlreadyExistsException(userRequest.username());
                });

        KeycloakRequest keycloakRequest = new KeycloakRequest(
                userRequest.email(), userRequest.username(), userRequest.password());

        String keycloakId = keycloakApiClient.createUserAndReturnCreatedId(keycloakRequest)
                .flatMap(response -> {
                    if (response.has("keycloakId")) {
                        return Mono.just(response.get("keycloakId").asText());
                    } else {
                        return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Failed to retrieve user ID from Keycloak response."));
                    }
                })
                .block();

        return userMapper.userToUserResponse(
                userRepository.save(
                        User.builder()
                                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                                .withKeycloakId(keycloakId)
                                .withEmail(userRequest.email())
                                .withUsername(userRequest.username())
                                .build()));
    }

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findUserByEmail(loginRequest.identifier())
                .or(() -> userRepository.findUserByUsername(loginRequest.identifier()))
                .orElseThrow(InvalidCredentialsException::new);

        TokenResponse tokenResponse = Mono.from(keycloakApiClient.login(loginRequest.identifier(), loginRequest.password())).map(jsonNode -> {
            String accessToken = jsonNode.get("access_token").asText();
            String refreshToken = jsonNode.get("refresh_token").asText();
            return new TokenResponse(accessToken, refreshToken);
        }).block();

        return new LoginResponse(user.getId(), tokenResponse);
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest tokenRequest) {
        return Mono.from(keycloakApiClient.refreshToken(tokenRequest.refreshToken())).map(jsonNode -> {
            String refreshToken = jsonNode.get("refresh_token").asText();
            String accessToken = jsonNode.get("access_token").asText();
            return new TokenResponse(accessToken, refreshToken);
        }).block();
    }

    @Override
    public void sendVerificationEmail(String email) {
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        JsonNode response = keycloakApiClient.sendVerificationEmail(user.getKeycloakId()).block();
        log.info("AuthServiceImpl::sendVerificationEmail: {}", response);
//        return ResponseEntity.ok().build();
    }
}
