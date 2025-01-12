package app.sportahub.userservice.exception.user.friend;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Friend not found in user's friend list.")
public class FriendNotFoundInFriendListException extends ResponseStatusException {

  public FriendNotFoundInFriendListException(String userIdentifier, String friendIdentifier) {
    super(HttpStatus.NOT_FOUND, "User with identifier: " + userIdentifier
            + " does not have friend with identifier: " + friendIdentifier + " in their friend list." );
  }
}
