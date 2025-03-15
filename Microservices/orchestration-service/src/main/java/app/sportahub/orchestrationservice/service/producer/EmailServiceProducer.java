package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;

public interface EmailServiceProducer {

    void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
