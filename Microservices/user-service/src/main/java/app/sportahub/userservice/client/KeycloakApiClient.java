package app.sportahub.userservice.client;

import app.sportahub.userservice.config.auth.KeycloakConfig;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.exception.user.keycloak.KeycloakCommunicationException;
import app.sportahub.userservice.model.user.keycloak.KeycloakUser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.time.Instant;

/**
 * A client for communicating with Keycloak to perform CRUD operations on users, as well as login functionality.
 * Handles token management by caching the access token until expiration.
 */
@Slf4j
@Component
public class KeycloakApiClient {

    private final WebClient webClient;
    private final KeycloakConfig keycloakConfig;
    private final ObjectMapper objectMapper;
    private String cachedAccessToken;
    private Instant tokenExpirationTime;

    public KeycloakApiClient(WebClient.Builder webClientBuilder, KeycloakConfig keycloakConfig, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.keycloakConfig = keycloakConfig;
        this.objectMapper = objectMapper;
    }

    /**
     * Sends a request to Keycloak to create a new user based on the provided {@link KeycloakRequest}.
     * If the request is successful, extracts the newly created user's ID from the "Location" header
     * in the response and returns it in a {@code JsonNode}. If an error occurs, handles the error
     * response accordingly.
     *
     * @param userRequest The {@link KeycloakRequest} object containing user details (email, username, password)
     *                    required for creating a new user.
     * @return A {@code Mono<JsonNode>} containing the user's ID in the format {"keycloakId": "userId"} if successful.
     * @throws KeycloakCommunicationException if there is a communication issue with Keycloak or the response indicates an error.
     */
    public Mono<JsonNode> createUserAndReturnCreatedId(KeycloakRequest userRequest) {
        String userCreationUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/admin/realms/" + keycloakConfig.getRealm() + "/users")
                .toUriString();

        log.debug("Attempting to create user with token: {}", getAccessToken());
        log.debug("User creation URL: {}", userCreationUrl);

        return webClient.post()
                .uri(userCreationUrl)
                .header("Authorization", "Bearer " + getAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(userRequest)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return extractUserIdFromLocationHeader(response);
                    } else {
                        return handleErrorResponse(response);
                    }
                });
    }

    /**
     * Retrieves user information from Keycloak by user ID.
     * This method sends a GET request to Keycloak's user management endpoint to fetch details
     * of the specified user. If the request is successful (HTTP 2xx), it maps the response
     * body to a {@link KeycloakUser} object. In case of an error response, it handles the error
     * and emits a {@link KeycloakCommunicationException} with the appropriate status code and
     * error message from Keycloak.
     *
     * @param userId The ID of the user to retrieve from Keycloak.
     * @return A {@code Mono<KeycloakUser>} containing the user's information if found,
     * or an error Mono if the request fails.
     * @throws KeycloakCommunicationException if there is an error in communicating with Keycloak,
     *                                        or if the user is not found, with the appropriate HTTP status code and message.
     */
    public Mono<KeycloakUser> getUserById(String userId) {
        String token = getAccessToken();
        String userUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/admin/realms/" + keycloakConfig.getRealm() + "/users/" + userId)
                .toUriString();

        return webClient.get()
                .uri(userUrl)
                .header("Authorization", "Bearer " + token)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(KeycloakUser.class);
                    } else {
                        return handleErrorResponse(response).cast(KeycloakUser.class);
                    }
                });
    }

    /**
     * Retrieves a user from Keycloak based on the exact username provided.
     * This method queries Keycloak's user API to find users with a matching username.
     * If a user is found with an exact username match, it returns the {@link KeycloakUser} object
     * for that user. If no exact match is found, or if an error occurs, an appropriate exception is returned.
     *
     * @param username The exact username of the user to be retrieved from Keycloak.
     * @return A {@code Mono<KeycloakUser>} containing the user information if an exact match is found.
     * If no exact match is found, it returns a {@link KeycloakCommunicationException} with {@code HttpStatus.NOT_FOUND}.
     * @throws KeycloakCommunicationException if the response from Keycloak indicates an error.
     *                                        This exception will include the HTTP status and error message received from Keycloak.
     */
    public Mono<KeycloakUser> getUserByUsername(String username) {
        String userUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/admin/realms/" + keycloakConfig.getRealm() + "/users")
                .queryParam("username", username)
                .toUriString();

        return webClient.get()
                .uri(userUrl)
                .header("Authorization", "Bearer " + getAccessToken())
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(JsonNode.class)
                                .flatMap(users -> {
                                    if (users.isArray()) {
                                        for (JsonNode userNode : users) {
                                            KeycloakUser user = objectMapper.convertValue(userNode, KeycloakUser.class);
                                            if (username.equals(user.getUsername())) {
                                                return Mono.just(user);
                                            }
                                        }
                                    }
                                    return Mono.error(new KeycloakCommunicationException(
                                            HttpStatus.NOT_FOUND, "User not found."));
                                });
                    } else {
                        return handleErrorResponse(response).cast(KeycloakUser.class);
                    }
                });
    }

    /**
     * Updates the details of an existing user in Keycloak.
     *
     * <p>This method sends a PUT request to the Keycloak Admin API to update a user's information.
     * The user is identified by their unique user ID, and the updates are provided in the
     * {@code KeycloakRequest} object. Only non-null fields in {@code KeycloakRequest} will be included
     * in the request body if the class is configured with {@code @JsonInclude(JsonInclude.Include.NON_NULL)}.
     *
     * <p>The request requires an authorization token with sufficient privileges to update users in Keycloak.
     * If the update is successful, the method completes with an empty {@code Mono<Void>}. If the update fails,
     * a {@code KeycloakCommunicationException} is thrown with the HTTP status code and an error message.
     *
     * @param userId            the unique identifier of the user to be updated in Keycloak
     * @param updateUserRequest an object containing the fields to be updated for the user;
     *                          any non-null fields will be included in the request
     * @return a {@code Mono<Void>} that completes empty if the update is successful,
     * or emits an error if the update fails
     * @throws KeycloakCommunicationException if the update fails due to an error response from Keycloak
     */
    public Mono<Void> updateUser(String userId, KeycloakRequest updateUserRequest) {
        String userUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/admin/realms/" + keycloakConfig.getRealm() + "/users/" + userId)
                .toUriString();

        return webClient.put()
                .uri(userUrl)
                .header("Authorization", "Bearer " + getAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(updateUserRequest)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return Mono.empty();
                    } else {
                        return handleErrorResponse(response).then(Mono.error(
                                new KeycloakCommunicationException((HttpStatus) response.statusCode(), "Failed to update user.")));
                    }
                });
    }

    /**
     * Deletes an existing user from Keycloak.
     *
     * <p>This method sends a DELETE request to the Keycloak Admin API to remove a user from the specified realm.
     * The user is identified by their unique user ID. The method automatically retrieves an authorization token
     * with sufficient privileges to perform the deletion, and includes it in the request. If the deletion is successful,
     * the method completes with an empty {@code Mono<Void>}. If the deletion fails, an exception is returned
     * with the status code and error message from Keycloak.
     *
     * <p>Error handling is included using {@code onStatus}, which checks the HTTP status code of the response.
     * If the status code indicates an error, the method retrieves the error message from the response body and
     * throws a {@code KeycloakCommunicationException} containing the status code and error details.
     *
     * @param userId the unique identifier of the user to be deleted in Keycloak
     * @return a {@code Mono<Void>} that completes empty if the deletion is successful,
     * or emits an error if the deletion fails
     * @throws KeycloakCommunicationException if the deletion fails due to an error response from Keycloak
     */
    public Mono<Void> deleteUser(String userId) {
        String userUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/admin/realms/" + keycloakConfig.getRealm() + "/users/" + userId)
                .toUriString();

        return webClient.delete()
                .uri(userUrl)
                .header("Authorization", "Bearer " + getAccessToken())
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return Mono.empty();
                    } else {
                        return handleErrorResponse(response).then(Mono.empty());
                    }
                });
    }

    /**
     * Authenticates a user with Keycloak and retrieves an access token.
     *
     * <p>This method sends a POST request to the Keycloak token endpoint with the user's credentials
     * using the `password` grant type. The request includes the client ID, client secret, username or email,
     * and password. If the login is successful, the method returns a {@code Mono<JsonNode>} containing
     * the token response from Keycloak. If the login fails, it throws a {@code KeycloakCommunicationException}
     * with the status code and error message for easier troubleshooting.
     *
     * <p>The {@code identifier} parameter can represent either a username or an email, depending on how
     * Keycloak is configured for user authentication.
     *
     * <p>Error handling is included using {@code onStatus}, which checks the HTTP status code of the response.
     * If the response indicates an error, the method retrieves the error details from the response body and
     * includes them in the exception.
     *
     * @param identifier the username or email identifier for the user
     * @param password   the user's password
     * @return a {@code Mono<JsonNode>} containing the token response if the login is successful,
     * or emits an error if the login fails
     * @throws KeycloakCommunicationException if the login fails due to an error response from Keycloak,
     *                                        providing the status code and error details
     */
    public Mono<JsonNode> login(String identifier, String password) {
        String tokenUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/token")
                .toUriString();

        String body = "grant_type=password" +
                "&client_id=" + keycloakConfig.getAdminClientId() +
                "&client_secret=" + keycloakConfig.getAdminClientSecret() +
                "&username=" + identifier +
                "&password=" + password;

        return webClient.post()
                .uri(tokenUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue(body)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(JsonNode.class);
                    } else {
                        return handleErrorResponse(response);
                    }
                });
    }

    /**
     * Logs out a user from Keycloak by invalidating the refresh token.
     *
     * <p>This method sends a POST request to the Keycloak token revocation endpoint to invalidate
     * the user's refresh token, which also invalidates the associated access token.
     * The request includes the client ID, client secret, and the refresh token. If the logout is
     * successful, the method completes with an empty {@code Mono<Void>}. If the logout fails, it
     * throws a {@code KeycloakCommunicationException} with the status code and error message.
     *
     * @param refreshToken the refresh token to be invalidated, effectively logging out the user
     * @return a {@code Mono<Void>} that completes empty if the logout is successful,
     * or emits an error if the logout fails
     * @throws KeycloakCommunicationException if the logout fails due to an error response from Keycloak
     */
    public Mono<Void> logout(String refreshToken) {
        String logoutUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/revoke")
                .toUriString();

        String body = "client_id=" + keycloakConfig.getAdminClientId() +
                "&client_secret=" + keycloakConfig.getAdminClientSecret() +
                "&token=" + refreshToken;

        return webClient.post()
                .uri(logoutUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue(body)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return Mono.empty();
                    } else {
                        return handleErrorResponse(response).then(Mono.empty());
                    }
                });
    }

    /**
     * Refreshes the Keycloak access token using the provided refresh token.
     *
     * <p>This method sends a POST request to the Keycloak token endpoint with the `refresh_token`
     * grant type to obtain a new access token. The request includes the client ID, client secret,
     * and the refresh token. If the refresh is successful, the method returns a {@code Mono<JsonNode>}
     * containing the new token response. If the refresh fails, it throws a {@code KeycloakCommunicationException}
     * with the status code and error message.
     *
     * @param refreshToken the refresh token used to obtain a new access token
     * @return a {@code Mono<JsonNode>} containing the refreshed token response if successful,
     * or emits an error if the refresh fails
     * @throws KeycloakCommunicationException if the refresh fails due to an error response from Keycloak
     */
    public Mono<JsonNode> refreshToken(String refreshToken) {
        String tokenUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/token")
                .toUriString();

        String body = "grant_type=refresh_token" +
                "&client_id=" + keycloakConfig.getAdminClientId() +
                "&client_secret=" + keycloakConfig.getAdminClientSecret() +
                "&refresh_token=" + refreshToken;

        return webClient.post()
                .uri(tokenUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue(body)
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return Mono.empty();
                    } else {
                        return handleErrorResponse(response).then(Mono.empty());
                    }
                });
    }

    /**
     * Retrieves an access token using client credentials.
     * Caches the token and reuses it until it expires.
     *
     * @return A valid access token as a String.
     * @throws RuntimeException If token retrieval or parsing fails.
     */
    private String getAccessToken() {
        if (cachedAccessToken != null && Instant.now().isBefore(tokenExpirationTime)) {
            return cachedAccessToken;
        }

        String tokenUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/token")
                .toUriString();

        String response = webClient.post()
                .uri(tokenUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue("grant_type=client_credentials" +
                        "&client_id=" + keycloakConfig.getAdminClientId() +
                        "&client_secret=" + keycloakConfig.getAdminClientSecret())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            cachedAccessToken = jsonNode.get("access_token").asText();
            int expiresIn = jsonNode.get("expires_in").asInt();
            tokenExpirationTime = Instant.now().plusSeconds(expiresIn);
        } catch (Exception e) {
            log.error("Failed to parse access token response", e);
            throw new RuntimeException("Failed to obtain access token", e);
        }

        return cachedAccessToken;
    }

    /**
     * Extracts the user ID from the "Location" header in the Keycloak response.
     * This method assumes that the "Location" header contains the URL ending with the user ID.
     *
     * @param response The {@link ClientResponse} from Keycloak, expected to contain the "Location" header.
     * @return A {@code Mono<JsonNode>} containing the user ID in the format {"keycloakId": "userId"}.
     */
    private Mono<JsonNode> extractUserIdFromLocationHeader(ClientResponse response) {
        String locationHeader = response.headers().asHttpHeaders().getLocation().toString();
        String userId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1);

        ObjectNode result = objectMapper.createObjectNode();
        result.put("keycloakId", userId);
        return Mono.just(result);
    }

    /**
     * Handles error responses from Keycloak by extracting the error message from the response body
     * and logging it for troubleshooting. Creates and returns a {@link KeycloakCommunicationException}
     * with the appropriate HTTP status code and error message.
     *
     * @param response The {@link ClientResponse} from Keycloak, expected to contain the error information.
     * @return A {@code Mono<JsonNode>} that emits an error, specifically a {@link KeycloakCommunicationException},
     * containing the HTTP status code and error message from the response.
     */
    private Mono<JsonNode> handleErrorResponse(ClientResponse response) {
        return response.bodyToMono(JsonNode.class)
                .flatMap(errorBody -> {
                    String errorMsg = errorBody.has("errorMessage") ?
                            errorBody.get("errorMessage").asText() :
                            errorBody.has("error") ?
                                    errorBody.get("error").asText() : "Unknown error";

                    log.error("Error response from Keycloak: Status {}, Error: {}", response.statusCode(), errorMsg);

                    HttpStatus statusCode = HttpStatus.resolve(response.statusCode().value());

                    if (statusCode == null) {
                        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    }

                    return Mono.error(new KeycloakCommunicationException(statusCode, errorMsg));
                });
    }
}