package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserRequestEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserResponseEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordEvent;
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
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
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
                UUID.randomUUID().toString());
        ForgotPasswordRequestedEvent forgotPasswordRequestedEvent = new ForgotPasswordRequestedEvent(baseEvent, email);
        kafkaTemplate.send(ForgotPasswordEvent.SEND_REQUEST_TOPIC, forgotPasswordRequestedEvent);
        log.info("OrchestrationServiceProducerImpl::sendPasswordResetEmail: forgot password reset email sent to 'forgot-password.request' topic");
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

        JoinedEventsByUserRequestEvent requestEvent = new JoinedEventsByUserRequestEvent(baseEvent, userId);

        try{
            ProducerRecord<String, Object> record = new ProducerRecord<>(
                    JoinedEventsByUserEvent.REQUEST_TOPIC,
                    requestEvent
            );
            record.headers().add(KafkaHeaders.REPLY_TOPIC, JoinedEventsByUserEvent.RESPONSE_TOPIC.getBytes());

            RequestReplyFuture<String, Object, Object> future = replyingKafkaTemplate.sendAndReceive(record);
            log.info("OrchestrationServiceProducerImpl::getEventsJoinedByUser: request topic");

            SendResult<String, Object> sendResult = future.getSendFuture().get();
            sendResult.getProducerRecord().headers().forEach(header -> System.out.println(header.key() + ":" + header.value().toString()));

            ConsumerRecord<String, Object> response = future.get(90, TimeUnit.SECONDS);
            log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: fetched topic");

            if (response.value() instanceof JoinedEventsByUserResponseEvent responseEvent) {
                System.out.println(responseEvent.getEventIds());
                log.info("eventIds: {}", responseEvent.getEventIds());

                return responseEvent.getEventIds();
            }

        } catch (InterruptedException e) {
            log.error(e.getMessage());
        } catch (ExecutionException e) {
            log.error(e.getMessage());
        } catch (TimeoutException e) {
            log.error(e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage());
        } finally {
            replyingKafkaTemplate.stop();
        }

        return Collections.<String> emptyList();
//        ProducerRecord<String, Object> record =
//                new ProducerRecord<>(REQUEST_TOPIC, requestEvent);
//
//        RequestReplyFuture<String, Object, Object> future = replyingKafkaTemplate.sendAndReceive(record);
//
//        // Wait for response (set timeout as needed)
//        ConsumerRecord<String, Object> response = future.get(5, TimeUnit.SECONDS);
//
//        try {
//            RequestReplyFuture<String, Object, Object> future =
//                    replyingKafkaTemplate.sendAndReceive(record);
//
//            JoinedEventsByUserResponseEvent responseEvent = future.get().value();
//
//            log.info("OrchestrationServiceProducerImpl::getEventsJoinedByUser:  topic");
//            return responseEvent.getEventIds();
//        } catch (Exception e) {
//            log.error("Failed to get response from orchestration-service", e);
//            return Collections.emptyList();
//        }
    }
}
