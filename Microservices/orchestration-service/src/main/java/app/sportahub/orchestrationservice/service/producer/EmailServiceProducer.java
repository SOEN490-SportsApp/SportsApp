package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafkevents.forgotpassword.ForgotPasswordSendEmailEvent;

public interface EmailServiceProducer {

    void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
