package app.sportahub.userservice.service.keycloak;

import com.fasterxml.jackson.databind.JsonNode;

import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.model.user.keycloak.KeycloakUser;
import reactor.core.publisher.Mono;

public interface KeycloakService {

    Mono<JsonNode> createUserAndReturnCreatedId(KeycloakRequest keycloakRequest);
    Mono<KeycloakUser> getUserById(String userId);
    Mono<KeycloakUser> getUserByUsername(String username);
    Mono<Void> updateUser(String userId, KeycloakRequest keycloakRequest);
    Mono<Void> deleteUser(String userId);
    Mono<JsonNode> login(String identifier, String password);
    Mono<Void> logout(String refreshToken);
    Mono<JsonNode> refreshToken(String refreshToken);
    Mono<JsonNode> sendVerificationEmail(String userId);
    Mono<Void> sendPasswordResetEmail(String userId);


}
