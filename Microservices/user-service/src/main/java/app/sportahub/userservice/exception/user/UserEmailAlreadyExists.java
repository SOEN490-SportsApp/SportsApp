package app.sportahub.userservice.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "User with this email already exists.")
public class UserEmailAlreadyExists extends ResponseStatusException {

    public UserEmailAlreadyExists(String email) {
        super(HttpStatus.CONFLICT, "User with this email:" + email + " already exists.");
    }
}
