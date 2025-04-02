package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafka.events.ForgotPasswordSendEmailEvent;

public interface EmailServiceProducer {

    void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
