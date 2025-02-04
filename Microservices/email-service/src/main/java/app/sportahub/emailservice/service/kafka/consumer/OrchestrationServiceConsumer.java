package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.kafkevents.ForgotPasswordValidateEvent;
import jakarta.mail.MessagingException;

public interface OrchestrationServiceConsumer {

    void listenForForgotPasswordValidateEvent(ForgotPasswordValidateEvent forgotPasswordValidateEvent) throws MessagingException;
}
