package app.sportahub.messagingservice.exception;

import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "User is not a member of the chatroom.")
public class UserIsNotAChatroomMemberException extends ResponseStatusException {

    public UserIsNotAChatroomMemberException(String chatroomId, String userId) {

        super(HttpStatus.BAD_REQUEST, "User with id " + userId + " is not a member of the chatroom with id: " + chatroomId);
    }
}
