package app.sportahub.notificationservice.exception.device;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserDoesNotOwnADeviceException extends ResponseStatusException {
    public UserDoesNotOwnADeviceException(String userId) {
        super(HttpStatus.NOT_FOUND, "The user with id " + userId + " does not own a device.");
    }
}
