package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Sorting field is invalid for the Event Model.")
public class InvalidEventSortingFieldException extends ResponseStatusException {

    public InvalidEventSortingFieldException(String field) {
        super(HttpStatus.BAD_REQUEST, "Sorting field: " + field + " is invalid for the Event Model.");
    }
}
