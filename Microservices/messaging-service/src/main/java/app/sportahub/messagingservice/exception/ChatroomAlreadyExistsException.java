package app.sportahub.messagingservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Chatroom with the same creator, members, and name already exists.")
public class ChatroomAlreadyExistsException extends ResponseStatusException {

    public ChatroomAlreadyExistsException(String createdBy, String chatroomName) {

      super(HttpStatus.CONFLICT, "Chatroom with the same creator: " + createdBy + ", name: " + chatroomName +
              ", and members already exists.");
    }
}