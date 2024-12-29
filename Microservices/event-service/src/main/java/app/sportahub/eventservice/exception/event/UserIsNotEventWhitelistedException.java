package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "User is not whitelisted for this event.")
public class UserIsNotEventWhitelistedException extends RuntimeException {

    public UserIsNotEventWhitelistedException(String userId, String eventId) {
        super("User with id: " + userId + " is not whitelisted to join the event with id: " + eventId + ".");
    }
}
