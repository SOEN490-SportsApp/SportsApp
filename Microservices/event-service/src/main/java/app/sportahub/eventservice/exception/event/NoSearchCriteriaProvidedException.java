package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE, reason = "No Search Criteria Provided.")
public class NoSearchCriteriaProvidedException extends ResponseStatusException {
    public NoSearchCriteriaProvidedException() {
        super(HttpStatus.NOT_ACCEPTABLE, "No Search Criteria Provided.");
    }
}
