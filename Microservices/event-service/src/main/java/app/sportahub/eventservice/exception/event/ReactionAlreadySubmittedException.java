package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE, reason = "Event is closed for registration.")
public class ReactionAlreadySubmittedException extends ResponseStatusException {
    public ReactionAlreadySubmittedException(String eventId, String userId) {
        super(HttpStatus.NOT_ACCEPTABLE, "This reaction is already submitted to event with id: " + eventId + " by user with id: " + userId);
    }
}
