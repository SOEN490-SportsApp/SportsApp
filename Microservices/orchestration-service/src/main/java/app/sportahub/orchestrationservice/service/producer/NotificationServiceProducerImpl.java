package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.notification.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceProducerImpl implements NotificationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @SneakyThrows
    @Override
    public void sendNotification(NotificationEvent event) {
        kafkaTemplate.send(SportaKafkaEvents.NOTIFICATION_SEND_TOPIC, event);
        log.info("NotificationServiceProducerImpl:: NotificationEvent sent to {}", SportaKafkaEvents.NOTIFICATION_SEND_TOPIC);
    }
}

