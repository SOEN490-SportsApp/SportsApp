package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.ForgotPasswordSendEmailEvent;
import jakarta.mail.MessagingException;

public interface OrchestrationServiceConsumer {

    void listenForForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent) throws MessagingException;
}
