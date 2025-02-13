package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Event already started.")
public class EventAlreadyStartedException extends ResponseStatusException {
    public EventAlreadyStartedException(String eventId) {
        super(HttpStatus.FORBIDDEN, "The event with id: " + eventId + " already started.");
    }
}
