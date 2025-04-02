package app.sportahub.notificationservice.service.kafka.consumer;

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

    @KafkaListener(topics = "event-updates", groupId = "notification-service", containerFactory = "kafkaListenerContainerFactory")
    @Override
    public void consumeNotification(NotificationRequest request) {
        log.info("Received notification: {}", request);
        notificationService.processNotification(request);
    }

}
