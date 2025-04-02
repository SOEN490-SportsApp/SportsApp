package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.kafkevents.forgotpassword.ForgotPasswordSendEmailEvent;

public interface OrchestrationServiceConsumer {

    void listenForForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
