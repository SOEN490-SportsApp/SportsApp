package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafkevents.joinsporteventevent.JoinedEventsByUserRequestEvent;
import app.sportahub.kafkevents.forgotpassword.ForgotPasswordRequestedEvent;

public interface UserServiceConsumer {
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent);
    public void listenForJoinedEventsByUserRequestEvent(JoinedEventsByUserRequestEvent requestEvent);
}
