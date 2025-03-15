package app.sportahub.notificationservice.exception.notification;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class NotificationException extends ResponseStatusException {
    public NotificationException(String message, Throwable cause) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, cause);
    }
}
