package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafka.events.forgotpassword.ForgotPasswordSendEmailEvent;

public interface EmailServiceProducer {

    void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
