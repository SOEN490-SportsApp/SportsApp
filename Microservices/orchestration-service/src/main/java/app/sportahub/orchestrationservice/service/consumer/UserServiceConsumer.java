package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserRequestEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;

public interface UserServiceConsumer {
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent);
    public void listenForJoinedEventsByUserRequestEvent(JoinedEventsByUserRequestEvent requestEvent);
}
