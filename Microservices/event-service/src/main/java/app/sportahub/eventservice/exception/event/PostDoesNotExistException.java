package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Post does not exist.")
public class PostDoesNotExistException extends ResponseStatusException {

    public PostDoesNotExistException(String id, String eventId) {
        super(HttpStatus.NOT_FOUND, "Post with id: " + id + " does not exist in event with id: " + eventId);
    }
}