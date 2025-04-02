package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafka.events.ForgotPasswordRequestedEvent;
import app.sportahub.kafka.events.joinsporteventevent.JoinedEventsByUserRequestEvent;

public interface UserServiceConsumer {
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent);
    public void listenForJoinedEventsByUserRequestEvent(JoinedEventsByUserRequestEvent requestEvent);
}
