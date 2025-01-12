package app.sportahub.userservice.exception.user.friend;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT,
        reason = "Given friend username does not match the friend found by the given request id.")
public class GivenFriendUsernameDoesNotMatchFriendFoundByIdException extends ResponseStatusException {
    public GivenFriendUsernameDoesNotMatchFriendFoundByIdException(String friendUsername, String requestId) {
        super(HttpStatus.CONFLICT, "Given friend with the username: " + friendUsername
                + " does not match the friend found with the given request id: " + requestId);
    }
}
