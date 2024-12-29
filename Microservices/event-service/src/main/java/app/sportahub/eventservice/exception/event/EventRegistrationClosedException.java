package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Event is closed for registration.")
public class EventRegistrationClosedException extends RuntimeException {

    public EventRegistrationClosedException(String eventId) {
        super("The event with id: " + eventId + " is closed for registration.");
    }
}
