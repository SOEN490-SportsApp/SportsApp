package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Event has reached its maximum capacity.")
public class EventFullException extends ResponseStatusException {

    public EventFullException(String eventId, String userId) {
        super(HttpStatus.CONFLICT, "User with id: " + userId + " cannot join event with id: "
                + eventId + " as it has reached its maximum capacity.");
    }
}
