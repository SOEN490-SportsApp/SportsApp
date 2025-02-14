package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Event creator cannot leave event.")
public class EventCreatorCannotLeaveEventException extends ResponseStatusException {
    public EventCreatorCannotLeaveEventException(String eventId, String userId) {
        super(HttpStatus.CONFLICT, "User with id: " + userId + " is the creator of event id: "
                + eventId );    }
}
