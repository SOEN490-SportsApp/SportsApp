package app.sportahub.userservice.exception.user.friend;

import app.sportahub.userservice.enums.user.UpdateFriendRequestActionEnum;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "The provided action is not valid.")
public class UnexpectedUpdateFriendRequestActionException extends ResponseStatusException {

  public UnexpectedUpdateFriendRequestActionException(UpdateFriendRequestActionEnum action) {
    super(HttpStatus.BAD_REQUEST, "The provided action: " + action.toString()
            + " is unexpected and therefore invalid.");
  }
}
