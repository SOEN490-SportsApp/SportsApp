package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.kafka.events.BaseEvent;
import app.sportahub.kafka.events.notification.NotificationEvent;
import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.forgotpassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafka.events.joinsporteventevent.JoinedEventsByUserRequestEvent;
import app.sportahub.kafka.events.joinsporteventevent.JoinedEventsByUserResponseEvent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.errors.TimeoutException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ReplyingKafkaTemplate<String, Object, Object> replyingKafkaTemplate;

    @SneakyThrows
    @Override
    public void sendPasswordResetEmailUsingKafka(String email) {
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString()
        );

        ForgotPasswordRequestedEvent event = new ForgotPasswordRequestedEvent(baseEvent, email);
        kafkaTemplate.send(SportaKafkaEvents.SEND_REQUEST_TOPIC, event);
        log.info("OrchestrationServiceProducerImpl::sendPasswordResetEmail: password reset email triggered.");
    }

    @SneakyThrows
    @Override
    public List<String> getEventsJoinedByUser(String userId) {
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString()
        );

        try {
            replyingKafkaTemplate.start();

            JoinedEventsByUserRequestEvent requestEvent = new JoinedEventsByUserRequestEvent(baseEvent, userId);

            ProducerRecord<String, Object> record = new ProducerRecord<>(SportaKafkaEvents.REQUEST_TOPIC, requestEvent);
            record.headers().add(KafkaHeaders.REPLY_TOPIC, SportaKafkaEvents.RESPONSE_TOPIC.getBytes());

            RequestReplyFuture<String, Object, Object> future = replyingKafkaTemplate.sendAndReceive(record);
            log.info("OrchestrationServiceProducerImpl::getEventsJoinedByUser: Sent Kafka request for userId={}", userId);

            SendResult<String, Object> sendResult = future.getSendFuture().get();
            ConsumerRecord<String, Object> response = future.get(5, TimeUnit.SECONDS);

            if (response.value() instanceof JoinedEventsByUserResponseEvent responseEvent
                    && Objects.equals(responseEvent.getBaseEvent().getCorrelationId(), requestEvent.getBaseEvent().getCorrelationId())) {
                log.info("OrchestrationServiceProducerImpl::getEventsJoinedByUser: Received Kafka response for userId={}", userId);
                return responseEvent.getEventIds();
            }
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Kafka error: {}", e.getMessage());
        } finally {
            replyingKafkaTemplate.stop();
        }

        return Collections.emptyList();
    }

    @SneakyThrows
    @Override
    public void sendNotificationEvent(NotificationEvent event) {
        kafkaTemplate.send(SportaKafkaEvents.NOTIFICATION_REQUEST_TOPIC, event);
        log.info("OrchestrationServiceProducerImpl::sendNotificationEvent: Sent notification for user {}", event.getUserId());
    }

}
