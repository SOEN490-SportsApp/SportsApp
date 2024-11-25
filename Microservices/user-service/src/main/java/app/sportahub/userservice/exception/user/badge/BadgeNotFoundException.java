package app.sportahub.userservice.exception.user.badge;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Badge not found")
public class BadgeNotFoundException extends ResponseStatusException {

    public BadgeNotFoundException(String badgeId) {
        super(HttpStatus.NOT_FOUND, "Badge not found for ID: " + badgeId);
    }
}
