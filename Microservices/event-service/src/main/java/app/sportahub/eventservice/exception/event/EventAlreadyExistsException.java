package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Event with this name already exists.")
public class EventAlreadyExistsException extends ResponseStatusException {

    public EventAlreadyExistsException(String eventName) {
        super(HttpStatus.CONFLICT, "Event with this name: " + eventName + " already exists.");
    }
}
