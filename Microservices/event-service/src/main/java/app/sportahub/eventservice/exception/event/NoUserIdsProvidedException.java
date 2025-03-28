package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE, reason = "No User Ids Provided.")
public class NoUserIdsProvidedException extends ResponseStatusException {
    public NoUserIdsProvidedException() {
        super(HttpStatus.NOT_ACCEPTABLE, "No User Ids Provided.");
    }
}
