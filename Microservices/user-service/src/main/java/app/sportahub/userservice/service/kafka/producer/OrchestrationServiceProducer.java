package app.sportahub.userservice.service.kafka.producer;

import java.util.List;

public interface OrchestrationServiceProducer {

    void sendPasswordResetEmailUsingKafka(String email);
    List<String> getEventsJoinedByUser(String userId);
}
