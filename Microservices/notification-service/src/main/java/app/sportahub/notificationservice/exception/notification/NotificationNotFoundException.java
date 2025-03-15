package app.sportahub.notificationservice.exception.notification;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotificationNotFoundException extends ResponseStatusException {
    public NotificationNotFoundException(String notificationId) {
        super(HttpStatus.NOT_FOUND, "Notification with Id " + notificationId + " not found");
    }
}
