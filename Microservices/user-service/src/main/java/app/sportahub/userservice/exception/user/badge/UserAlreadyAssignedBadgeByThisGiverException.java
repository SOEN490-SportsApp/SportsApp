package app.sportahub.userservice.exception.user.badge;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "This badge has already been assigned by this giver to this user.")
public class UserAlreadyAssignedBadgeByThisGiverException extends ResponseStatusException {

    public UserAlreadyAssignedBadgeByThisGiverException() {
        super(HttpStatus.BAD_REQUEST, "This badge has already been assigned by this giver to this user.");
    }
}
