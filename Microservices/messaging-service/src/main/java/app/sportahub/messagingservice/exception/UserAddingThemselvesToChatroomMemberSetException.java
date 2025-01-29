package app.sportahub.messagingservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "User trying to add themselves as a member to their own chatroom.")
public class UserAddingThemselvesToChatroomMemberSetException extends ResponseStatusException {

    public UserAddingThemselvesToChatroomMemberSetException(String userId) {

        super(HttpStatus.CONFLICT, "User with id " + userId + " is trying to add themselves to their own chatroom.");
    }
}
