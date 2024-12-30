package app.sportahub.userservice.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "User with email does not exist.")
public class UserWithEmailDoesNotExistException extends ResponseStatusException {

    public UserWithEmailDoesNotExistException(String email)
    {
        super(HttpStatus.NOT_FOUND, "User with email: " + email + " does not exist.");
    }
}
