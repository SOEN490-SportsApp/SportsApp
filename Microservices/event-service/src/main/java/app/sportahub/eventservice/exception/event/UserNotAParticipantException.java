package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "User is not a participant in the event.")
public class UserNotAParticipantException extends ResponseStatusException {
    public UserNotAParticipantException(String eventId, String userId) {
        super(HttpStatus.CONFLICT, "User with id: " + userId + " is not a participant in the event with id: "
                + eventId + ".");
    }
}
