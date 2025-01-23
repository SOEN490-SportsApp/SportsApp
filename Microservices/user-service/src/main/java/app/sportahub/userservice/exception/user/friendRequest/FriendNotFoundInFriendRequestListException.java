package app.sportahub.userservice.exception.user.friendRequest;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Friend not found in user's friend request list.")
public class FriendNotFoundInFriendRequestListException extends ResponseStatusException {

    public FriendNotFoundInFriendRequestListException(String userIdentifier, String friendIdentifier) {
        super(HttpStatus.NOT_FOUND, "User with identifier: " + userIdentifier
                + " does not have friend request with identifier: " + friendIdentifier + " in their friend request list." );
    }
}
