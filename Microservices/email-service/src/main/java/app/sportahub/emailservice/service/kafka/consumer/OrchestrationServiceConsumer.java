package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;
import jakarta.mail.MessagingException;

public interface OrchestrationServiceConsumer {

    void listenForForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
