package app.sportahub.userservice.exception.user.friend;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Friend does not exist.")
public class FriendDoesNotExistException extends ResponseStatusException {
    public FriendDoesNotExistException(String identifier) {
        super(HttpStatus.NOT_FOUND, "Friend with identifier: " + identifier + " does not exist.");
    }
}
