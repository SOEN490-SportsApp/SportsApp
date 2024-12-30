package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Event is closed for registration.")
public class EventRegistrationClosedException extends ResponseStatusException {

    public EventRegistrationClosedException(String eventId) {
        super(HttpStatus.FORBIDDEN, "The event with id: " + eventId + " is closed for registration.");
    }
}
