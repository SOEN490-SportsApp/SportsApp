package app.sportahub.messagingservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Message does not exist.")
public class MessageDoesNotExistException extends ResponseStatusException {

  public MessageDoesNotExistException(String messageId) {
    super(HttpStatus.NOT_FOUND, "Message with id: " + messageId + " does not exist.");
  }
}
