package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "This is not a valid reaction")
public class InvalidReactionException extends ResponseStatusException {
    public InvalidReactionException() {
      super(HttpStatus.NOT_ACCEPTABLE, "This reaction does not exist.");
    }
}
