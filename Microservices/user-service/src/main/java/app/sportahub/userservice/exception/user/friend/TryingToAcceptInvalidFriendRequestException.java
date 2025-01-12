package app.sportahub.userservice.exception.user.friend;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Trying to accept a friend request not labelled as RECEIVED.")
public class TryingToAcceptInvalidFriendRequestException extends ResponseStatusException {

  public TryingToAcceptInvalidFriendRequestException(String userIdentifier,
                                                     String friendIdentifier, FriendRequestStatusEnum status) {

    super(HttpStatus.CONFLICT, "User with identifier: " + userIdentifier
            + " is trying to accept a friend request from: " + friendIdentifier
            + " but the status of the friend request is " + status + " instead of RECEIVED.");
  }
}
