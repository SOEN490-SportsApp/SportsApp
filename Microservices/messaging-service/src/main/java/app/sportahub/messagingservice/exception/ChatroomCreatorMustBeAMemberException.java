package app.sportahub.messagingservice.exception;

public class ChatroomCreatorMustBeAMemberException extends RuntimeException {
    public ChatroomCreatorMustBeAMemberException(String message) {
        super(message);
    }
}
