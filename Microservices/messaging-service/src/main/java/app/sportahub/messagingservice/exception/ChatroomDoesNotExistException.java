package app.sportahub.messagingservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Chatroom does not exist.")
public class ChatroomDoesNotExistException extends ResponseStatusException {

    public ChatroomDoesNotExistException(String chatroomId) {
        super(HttpStatus.NOT_FOUND, "Chatroom with id: " + chatroomId + " does not exist.");
    }
}
