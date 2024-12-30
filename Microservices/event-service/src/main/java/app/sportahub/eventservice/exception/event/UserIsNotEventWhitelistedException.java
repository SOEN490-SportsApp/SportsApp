package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "User is not whitelisted for this event.")
public class UserIsNotEventWhitelistedException extends ResponseStatusException {

    public UserIsNotEventWhitelistedException(String userId, String eventId) {
        super(HttpStatus.FORBIDDEN,
                "User with id: " + userId + " is not whitelisted to join the event with id: " + eventId + ".");
    }
}
