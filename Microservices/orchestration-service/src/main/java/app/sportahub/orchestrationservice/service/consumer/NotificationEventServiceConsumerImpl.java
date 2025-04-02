package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafka.events.BaseEvent;
import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.notification.NotificationEvent;
import app.sportahub.orchestrationservice.service.producer.NotificationServiceProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationEventServiceConsumerImpl {

    private final NotificationServiceProducer notificationServiceProducer;

    @KafkaListener(topics = SportaKafkaEvents.NOTIFICATION_REQUEST_TOPIC, groupId = "OrchestrationServiceKafkaConsumer")
    public void listenForNotificationRequest(NotificationEvent event) {
        log.info("NotificationEventServiceConsumerImpl:: Received NotificationEvent request for user {}", event.getUserId());

        NotificationEvent outbound = new NotificationEvent(
                new BaseEvent(
                        UUID.randomUUID().toString(),
                        "send",
                        "orchestration-service",
                        Instant.now(),
                        UUID.randomUUID().toString()
                ),
                event.getUserId(),
                event.getMessageTitle(),
                event.getMessageBody(),
                event.getData(),
                event.getClickAction(),
                event.getIcon(),
                event.getMessageSubtitle(),
                event.getBadgeCount(),
                event.getPlaySound()
        );

        notificationServiceProducer.sendNotification(outbound);
    }
}
