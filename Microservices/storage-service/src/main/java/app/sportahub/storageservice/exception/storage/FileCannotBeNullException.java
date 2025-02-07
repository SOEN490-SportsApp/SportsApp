package app.sportahub.storageservice.exception.storage;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "The file provided cannot be null.")
public class FileCannotBeNullException extends ResponseStatusException {

    public FileCannotBeNullException() {
        super(HttpStatus.BAD_REQUEST, "The file provided cannot be null.");
    }
}
