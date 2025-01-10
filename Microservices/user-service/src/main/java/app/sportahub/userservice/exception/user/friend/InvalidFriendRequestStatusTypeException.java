package app.sportahub.userservice.exception.user.friend;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Invalid friend request status type.")
public class InvalidFriendRequestStatusTypeException extends ResponseStatusException {

    public InvalidFriendRequestStatusTypeException(FriendRequestStatusEnum status)
    {
        super(HttpStatus.BAD_REQUEST, "Invalid friend request status type: "
                + status.toString() + " for this operation.");
    }
}
