package app.sportahub.userservice.service.kafka.producer;


public interface OrchestrationServiceProducer {

    void sendPasswordResetEmailUsingKafka(String email);
}
