package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafkevents.ForgotPasswordSendEmailEvent;

public interface EmailServiceProducer {

    void sendForgotPasswordValidateEvent(ForgotPasswordSendEmailEvent event);
}
