package app.sportahub.userservice.service.kafka.producer;

import org.apache.kafka.common.errors.TimeoutException;
import java.util.List;

public interface OrchestrationServiceProducer {

    void sendPasswordResetEmailUsingKafka(String email);
    List<String> getEventsJoinedByUser(String userId);
}
