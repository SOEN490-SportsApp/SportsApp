package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.auth.RegistrationRequest;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final KeycloakApiClient keycloakApiClient;

    @SneakyThrows
    public User registerUser(RegistrationRequest userRequest) {
        Optional<User> optionalUserByEmail = Optional.ofNullable(userRepository.findUserByEmail(userRequest.email()));
        if (optionalUserByEmail.isPresent()) {
            throw new UserEmailAlreadyExistsException(userRequest.email());
        }

        Optional<User> optionalUserByUsername = Optional
                .ofNullable(userRepository.findUserByUsername(userRequest.username()));
        if (optionalUserByUsername.isPresent()) {
            throw new UsernameAlreadyExistsException(userRequest.username());
        }

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


        return userRepository.save(
                User.builder()
                        .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                        .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                        .withKeycloakId(keycloakId)
                        .withEmail(userRequest.email())
                        .withUsername(userRequest.username())
                        .build());
    }
}