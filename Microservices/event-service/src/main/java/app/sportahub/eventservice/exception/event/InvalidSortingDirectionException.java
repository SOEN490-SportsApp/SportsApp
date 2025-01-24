package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Sorting direction is invalid.")
public class InvalidSortingDirectionException extends ResponseStatusException {
    
    public InvalidSortingDirectionException(String direction) {
        super(HttpStatus.BAD_REQUEST, "Sorting direction: " + direction + " is invalid.");
    }

}
