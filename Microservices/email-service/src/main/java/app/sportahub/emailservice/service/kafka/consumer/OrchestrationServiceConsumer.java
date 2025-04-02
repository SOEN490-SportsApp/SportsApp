package app.sportahub.emailservice.service.kafka.consumer;


import app.sportahub.kafka.events.forgotpassword.ForgotPasswordSendEmailEvent;

public interface OrchestrationServiceConsumer {

    void listenForForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent);
}
