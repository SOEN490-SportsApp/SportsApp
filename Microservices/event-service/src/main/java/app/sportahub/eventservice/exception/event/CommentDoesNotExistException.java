package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Post does not exist.")
public class CommentDoesNotExistException extends ResponseStatusException {

    public CommentDoesNotExistException(String id) {
        super(HttpStatus.NOT_FOUND, "Comment with id: " + id + " does not exist ");
    }
}
