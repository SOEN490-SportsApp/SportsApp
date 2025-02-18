package app.sportahub.userservice.service.auth;

import app.sportahub.userservice.config.auth.KeycloakConfig;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.exception.user.keycloak.KeycloakCommunicationException;
import app.sportahub.userservice.mapper.keycloak.KeycloakMapper;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.model.user.keycloak.KeycloakUser;
import jakarta.ws.rs.core.Response;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.util.List;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.RefreshToken;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Generated;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;


@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.realm}")
    private String realm;
    private final Keycloak keycloak;
    private final KeycloakConfig keycloakConfig;
    private final KeycloakMapper keycloakMapper; 
    private final ObjectMapper objectMapper;   

    
    public Mono<JsonNode> createUserAndReturnCreatedId(KeycloakRequest keycloakRequest) {        
        UserRepresentation user = keycloakMapper.keycloakRequestToUserRepresentation(keycloakRequest);

        // Create User Representation 
        UsersResource usersResource = getUsersResource();
        Response response = usersResource.create(user);

        if (response.getStatus() == 201) {
            log.info("KeycloakService::createUserAndReturnCreatedId: User created successfully");
            return Mono.just(
                objectMapper.convertValue(extractKeycloakIdFromLocationHeader(response), JsonNode.class)
            );
        } else {
            return handleErrorResponse(response);
        }
    }

    public Mono<KeycloakUser> getUserById(String userId) {
        // Get User Representation
        UsersResource usersResource = getUsersResource();
        UserRepresentation user = usersResource.get(userId).toRepresentation();

        // If user is null, return error
        if(user == null) {
            return Mono.error(new KeycloakCommunicationException(HttpStatus.NOT_FOUND, "User not found"));
        }
        
        KeycloakUser keycloakUser = keycloakMapper.userRepresentationTKeycloakUser(user);
        return Mono.just(keycloakUser);
    }

    public Mono<KeycloakUser> getUserByUsername(String username) {
        UsersResource usersResource = getUsersResource();
        UserRepresentation user = usersResource.search(username, true).get(0);       
       // If user is null, return error
       if(user == null) {
           return Mono.error(new KeycloakCommunicationException(HttpStatus.NOT_FOUND, "User not found"));
       }
       
       KeycloakUser keycloakUser = keycloakMapper.userRepresentationTKeycloakUser(user);
       return Mono.just(keycloakUser);
    }

    // TODO: refractor updateUser method
    public Mono<Void> updateUser(String userId, KeycloakRequest keycloakRequest) {
        UserRepresentation user = this.keycloak.realm(keycloakConfig.getRealm())
                .users()
                .get(userId)
                .toRepresentation();
        
        if(user == null) {
            return Mono.error(new KeycloakCommunicationException(HttpStatus.NOT_FOUND, "User not found"));
        }


        if (keycloakRequest.email() != null) {
            user.setEmail(keycloakRequest.email());
            
        }
        if(keycloakRequest.username() != null) {
            user.setUsername(keycloakRequest.username());
        }
        if(keycloakRequest.firstName() != null) {
            user.setFirstName(keycloakRequest.firstName());
        }
        if(keycloakRequest.lastName() != null) {
            user.setLastName(keycloakRequest.lastName());
        }
        if(keycloakRequest.enabled() != null) {
            user.setEnabled(keycloakRequest.enabled());
        }
        if(keycloakRequest.attributes() != null) {
            user.setAttributes(keycloakRequest.attributes());
        }
        if(keycloakRequest.credentials() != null) {
            user.setCredentials(keycloakMapper.keycloakRequestToUserRepresentation(keycloakRequest).getCredentials());
        }
        if(keycloakRequest.attributes() != null) {
            user.setAttributes(keycloakRequest.attributes());
        }

        this.keycloak.realm(keycloakConfig.getRealm()).users().get(userId).update(user);
        
        return Mono.empty();
    }

    public Mono<Void> deleteUser(String userId) {
        UsersResource usersResource = getUsersResource();
        UserResource user = usersResource.get(userId);
        if(user == null) {
            return Mono.error(new KeycloakCommunicationException(HttpStatus.NOT_FOUND, "User not found"));
        }
        usersResource.delete(userId);
        log.info("KeycloakService::deleteUser: User with id: {} has been deleted successfully", userId);
        return Mono.empty();
    }
    
    public Mono<JsonNode> login(String identifier, String password) {
        String tokenUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/token")
                .toUriString();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String>  formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", OAuth2Constants.PASSWORD);
        formData.add("client_id", keycloakConfig.getAdminClientId());
        formData.add("client_secret", keycloakConfig.getAdminClientSecret());
        formData.add("username", identifier);
        formData.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            JsonNode response = restTemplate.postForObject(tokenUrl, request, JsonNode.class);
            log.info("KeycloakService::login: User with identifier: {} has logged in successfully", identifier);
            return Mono.just(response);
        } catch (Exception e) {
            return Mono.error(new KeycloakCommunicationException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
        }
    }

    public Mono<Void> logout(String refreshToken) {
        String logoutUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
        .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/revoke")
        .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String>  formData = new LinkedMultiValueMap<>();
        formData.add("client_id", keycloakConfig.getAdminClientId());
        formData.add("client_secret", keycloakConfig.getAdminClientSecret());
        formData.add("token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            JsonNode response = restTemplate.postForObject(logoutUrl, request, JsonNode.class);
            log.info("KeycloakService::logout: User with refreshToken: {} has logged out successfully", refreshToken);
            return Mono.empty();
        } catch (Exception e) {
            return Mono.error(new KeycloakCommunicationException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
        }

    }

    public Mono<JsonNode> refreshToken(String refreshToken) {
        String tokenUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthServerUrl())
                .path("/realms/" + keycloakConfig.getRealm() + "/protocol/openid-connect/token")
                .toUriString();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                MultiValueMap<String, String>  formData = new LinkedMultiValueMap<>();
                formData.add("grant_type", OAuth2Constants.REFRESH_TOKEN);
                formData.add("client_id", keycloakConfig.getAdminClientId());
                formData.add("client_secret", keycloakConfig.getAdminClientSecret());
                formData.add("refresh_token", refreshToken);

        
                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);
                RestTemplate restTemplate = new RestTemplate();
        
                try {
                    JsonNode response = restTemplate.postForObject(tokenUrl, request, JsonNode.class);
                    log.info("KeycloakService::refreshToken: Token refreshed : {}", refreshToken);
                    return Mono.just(response);
                } catch (Exception e) {
                    return Mono.error(new KeycloakCommunicationException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
                }
    
    }

    public Mono<JsonNode> sendVerificationEmail(String userId ) {
        UsersResource usersResource = getUsersResource();
        usersResource.get(userId).sendVerifyEmail();
        log.info("KeycloakService::sendVerificationEmail: Verification email sent to user with id: {}", userId);
        return Mono.empty();
    }

    public Mono<Void> sendPasswordResetEmail(String userId) {
        UsersResource usersResource = getUsersResource();
        usersResource.get(userId).executeActionsEmail(List.of("UPDATE_PASSWORD"));
        log.info("KeycloakService::sendPasswordResetEmail: Password reset email sent to user with id: {}", userId);
        return Mono.empty();
    }

    private UsersResource getUsersResource() {
        return this.keycloak.realm(realm).users();
    }

    private Mono<JsonNode> handleErrorResponse(Response response) {
        JsonNode errorBody = response.hasEntity() ? response.readEntity(JsonNode.class) : null;
        if(errorBody == null) {
            String errorMessage = "Error occurred while retrieving keycloak token. No response body available";
            return Mono.error(new KeycloakCommunicationException(HttpStatus.valueOf(response.getStatus()), errorMessage));
        }

        String errorMessage = errorBody.has("errorMessage") ?
                errorBody.get("errorMessage").asText() :
                errorBody.has("error") ? errorBody.get("error").asText() : "Unknown error";
        
        String errorDescription = errorBody.has("error_description") ?
                errorBody.get("error_description").asText() : "No error description available";
        
        String combinedError = String.format("%s: %s", errorMessage, errorDescription);

        HttpStatus status =  HttpStatus.resolve(response.getStatus()) == null ? HttpStatus.INTERNAL_SERVER_ERROR :
                HttpStatus.resolve(response.getStatus());
        
        return Mono.error(new KeycloakCommunicationException(status, combinedError));
    }

    private String extractKeycloakIdFromLocationHeader(Response response) {
        return response.getLocation().getPath().substring(response.getLocation().getPath().lastIndexOf('/') + 1);
    }



}
