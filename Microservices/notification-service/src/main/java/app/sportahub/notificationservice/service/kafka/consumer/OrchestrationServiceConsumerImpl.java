package app.sportahub.notificationservice.service.kafka.consumer;

import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.notification.NotificationEvent;
import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestrationServiceConsumerImpl implements OrchestrationServiceConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = SportaKafkaEvents.NOTIFICATION_SEND_TOPIC, groupId = "NotificationServiceKafkaConsumer")
    public void listenForNotificationEvent(NotificationEvent event) {
        log.info("NotificationServiceConsumerImpl:: Received NotificationEvent for user {}", event.getUserId());

        NotificationRequest notificationRequest = new NotificationRequest(
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
        notificationService.processNotification(notificationRequest);
    }
}
