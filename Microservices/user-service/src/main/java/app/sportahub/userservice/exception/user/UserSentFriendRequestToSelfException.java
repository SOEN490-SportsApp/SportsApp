package app.sportahub.userservice.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "User sent friend request to self.")
public class UserSentFriendRequestToSelfException extends ResponseStatusException {

    public UserSentFriendRequestToSelfException() {
        super(HttpStatus.CONFLICT, "Can't send friend request to self");
    }
}
