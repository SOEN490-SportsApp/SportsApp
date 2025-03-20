package app.sportahub.notificationservice.service.kafka.producer;

public interface OrchestrationServiceProducer {

    /**
     * Sends a message to a specified Kafka topic.
     *
     * @param topic   The Kafka topic to send the message to.
     * @param message The message payload.
     */
    void sendMessage(String topic, Object message);
}
