package app.sportahub.eventservice.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Coordinates are invalid for the Event Model.")
public class InvalidEventCoordinatesReceivedException extends ResponseStatusException {

    public InvalidEventCoordinatesReceivedException() {

        super(HttpStatus.BAD_REQUEST, "The given coordinates are null or not in the expected GeoJsonPoint format.");
    }
}
