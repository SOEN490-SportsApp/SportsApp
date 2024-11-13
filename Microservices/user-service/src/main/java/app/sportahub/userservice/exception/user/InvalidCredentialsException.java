package app.sportahub.userservice.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Invalid user credentials")
public class InvalidCredentialsException extends ResponseStatusException {

    public InvalidCredentialsException() {
        super(HttpStatus.UNAUTHORIZED, "invalid_grant: Invalid user credentials");
    }
}