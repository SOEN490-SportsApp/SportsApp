package app.sportahub.userservice.exception.user.keycloak;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus
public class KeycloakCommunicationException extends ResponseStatusException {

    public KeycloakCommunicationException(HttpStatus httpStatus, String message) {
        super(httpStatus, message);
    }
}
