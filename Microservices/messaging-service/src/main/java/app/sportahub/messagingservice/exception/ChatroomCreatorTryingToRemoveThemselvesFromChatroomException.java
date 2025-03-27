package app.sportahub.messagingservice.exception;

import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Chatroom creator trying to remove themselves from a chatroom.")
public class ChatroomCreatorTryingToRemoveThemselvesFromChatroomException extends ResponseStatusException {

    public ChatroomCreatorTryingToRemoveThemselvesFromChatroomException(String chatroomId, String userId) {
        super(HttpStatus.BAD_REQUEST, "User with id: " + userId + " is trying to remove themselves from the chatroom with id: " + chatroomId
        + ". This is not allowed because they are the creator of the chatroom. " +
                "Use the DELETE chatroom endpoint instead if that was the intention.");
    }
}
