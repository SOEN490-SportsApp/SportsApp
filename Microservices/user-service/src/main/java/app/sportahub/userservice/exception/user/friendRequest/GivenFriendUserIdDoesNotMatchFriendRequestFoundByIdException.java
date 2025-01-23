package app.sportahub.userservice.exception.user.friendRequest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT,
        reason = "Given friend user id does not match the friend found by the given request id.")
public class GivenFriendUserIdDoesNotMatchFriendRequestFoundByIdException extends ResponseStatusException {
    public GivenFriendUserIdDoesNotMatchFriendRequestFoundByIdException(String friendUserId, String requestId) {
        super(HttpStatus.CONFLICT, "Given friend request with the user id: " + friendUserId
                + " does not match the friend request found with the given request id: " + requestId);
    }
}
