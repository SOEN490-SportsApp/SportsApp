package app.sportahub.notificationservice.service.kafka.consumer;

public interface OrchestrationServiceConsumer {

    void consumeNotification(String message);
}
