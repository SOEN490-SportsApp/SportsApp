package app.sportahub.userservice.exception.user.friendRequest;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "User already in friend request list.")
public class UserAlreadyInFriendRequestListException extends ResponseStatusException {

    public UserAlreadyInFriendRequestListException(String username, Enum<FriendRequestStatusEnum> friendRequestStatus) {
        super(HttpStatus.CONFLICT, "User with username: " + username + " and status: "
                + friendRequestStatus + " already in friend request list.");
    }
}

