package app.sportahub.eventservice.service.kafka.producer;

import app.sportahub.kafka.events.notification.NotificationEvent;
import app.sportahub.kafka.events.SportaKafkaEvents;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @SneakyThrows
    @Override
    public void sendNotificationEvent(NotificationEvent event) {
        kafkaTemplate.send(SportaKafkaEvents.NOTIFICATION_REQUEST_TOPIC, event);
        log.info("OrchestrationServiceProducerImpl::sendNotificationEvent: NotificationEvent sent to topic for user {}", event.getUserId());
    }
}
