package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Event does not exist.")
public class EventDoesNotExistException extends ResponseStatusException {

    public EventDoesNotExistException(String id) {
        super(HttpStatus.CONFLICT, "Event with id: " + id + " does not exist.");
    }
}