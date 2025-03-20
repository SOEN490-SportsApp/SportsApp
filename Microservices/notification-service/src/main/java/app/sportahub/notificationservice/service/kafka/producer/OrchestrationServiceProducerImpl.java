package app.sportahub.notificationservice.service.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendMessage(String topic, Object message) {
        log.info("KafkaProducerServiceImpl::sendMessage: Sending message to topic {}: {}", topic, message);

        kafkaTemplate.send(topic, message)
                .thenAccept(result -> log.info("Message sent to topic {} at partition {} with offset {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset()))
                .exceptionally(e -> {
                    log.error("❌ Failed to send message to topic {}: {}", topic, e.getMessage());
                    return null;
                });
    }
}
