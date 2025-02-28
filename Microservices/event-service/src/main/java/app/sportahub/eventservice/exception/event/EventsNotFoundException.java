package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Events not found.")
public class EventsNotFoundException extends ResponseStatusException {

    public EventsNotFoundException() {
        super(HttpStatus.NOT_FOUND, "No events matching the provided criteria were found.");
    }
}
