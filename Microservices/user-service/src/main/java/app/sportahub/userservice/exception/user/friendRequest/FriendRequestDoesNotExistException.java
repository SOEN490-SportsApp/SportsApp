package app.sportahub.userservice.exception.user.friendRequest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Friend request does not exist.")
public class FriendRequestDoesNotExistException extends ResponseStatusException {
    public FriendRequestDoesNotExistException(String identifier) {
        super(HttpStatus.NOT_FOUND, "Friend request with identifier: " + identifier + " does not exist.");
    }
}
