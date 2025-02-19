package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;


@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Event is already cancelled.")
public class EventAlreadyCancelledException extends ResponseStatusException {
    public EventAlreadyCancelledException(String eventId) {
        super(HttpStatus.CONFLICT, "The event with id " + eventId + " is already cancelled.");
    }
}
