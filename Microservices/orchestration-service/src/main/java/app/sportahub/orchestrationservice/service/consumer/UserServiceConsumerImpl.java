package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.*;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordEvent;
import app.sportahub.orchestrationservice.service.producer.EmailServiceProducer;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.errors.TimeoutException;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserEvent.FETCHED_TOPIC;
import static app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserEvent.REQUEST_TOPIC;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceConsumerImpl{


    private final EmailServiceProducer emailServiceProducer;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ReplyingKafkaTemplate<String, Object, Object> replyingKafkaTemplate;

    @SneakyThrows
    @KafkaListener(topics = ForgotPasswordEvent.SEND_REQUEST_TOPIC, groupId ="UserServiceKafkaConsumer")
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent) {
        log.info("EmailServiceProducerImpl::listenForForgotPasswordRequestedEvent: received forgot password request with email : {} ", forgotPasswordRequestedEvent.getEmail());

        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "orchestration-service",
                Instant.now(),
                UUID.randomUUID().toString());

        ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent = new ForgotPasswordSendEmailEvent(
                baseEvent,
                forgotPasswordRequestedEvent.getEmail()
        );
        emailServiceProducer.sendForgotPasswordSendEmailEvent(forgotPasswordSendEmailEvent);
    }

    @SneakyThrows
    @KafkaListener(topics = {REQUEST_TOPIC, FETCHED_TOPIC} , groupId = "UserServiceKafkaConsumer")
    public void listenForJoinedEventsByUserRequestEvent(
            @Payload JoinedEventsByUserRequestEvent requestEvent,
            @Header(KafkaHeaders.CORRELATION_ID) byte[] correlationId){

        log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: received request for event ids for user with id: {}", requestEvent.getUserId());

        String userId = requestEvent.getUserId();
        BaseEvent fetchBaseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "orchestration-service",
                Instant.now(),
                requestEvent.getBaseEvent().getCorrelationId()
        );

        try{
            replyingKafkaTemplate.start();

            JoinedEventsByUserFetchEvent fetchEvent = new JoinedEventsByUserFetchEvent(fetchBaseEvent, userId);
            ProducerRecord<String, Object> record = new ProducerRecord<>(
                    JoinedEventsByUserEvent.FETCH_TOPIC,
                    fetchEvent
            );
            record.headers().add(new RecordHeader(KafkaHeaders.REPLY_TOPIC, JoinedEventsByUserEvent.FETCHED_TOPIC.getBytes()));
            record.headers().add(new RecordHeader(KafkaHeaders.CORRELATION_ID, correlationId));

            RequestReplyFuture<String, Object, Object> future =
                    replyingKafkaTemplate.sendAndReceive(record);
            log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: sent fetch request for event ids for user with id: {}", fetchEvent.getUserId());

            SendResult<String, Object> sendResult = future.getSendFuture().get();
            sendResult.getProducerRecord().headers().forEach(header -> System.out.println(header.key() + ":" + header.value().toString()));

            ConsumerRecord<String, Object> response = future.get(5, TimeUnit.SECONDS);
            log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: received reply for event ids for user with id: {}", fetchEvent.getUserId());

            if (response.value() instanceof JoinedEventsByUserFetchedEvent fetchedEvent
                    &&
                    Objects.equals(fetchedEvent.getBaseEvent().getCorrelationId(), fetchEvent.getBaseEvent().getCorrelationId()))
            {
                log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: received response for event ids for user with id: {}", requestEvent.getUserId());
            }
            else{
                throw new RuntimeException("Invalid response received");
            }

            BaseEvent fetchedBaseEvent = new BaseEvent(
                    UUID.randomUUID().toString(),
                    "response",
                    "orchestration-service",
                    Instant.now(),
                    fetchedEvent.getBaseEvent().getCorrelationId()
            );
            JoinedEventsByUserResponseEvent responseEvent = new JoinedEventsByUserResponseEvent(fetchedBaseEvent, fetchedEvent.getEventIds());

            ProducerRecord<String, Object> responseRecord = new ProducerRecord<>(JoinedEventsByUserEvent.RESPONSE_TOPIC, responseEvent);
            responseRecord.headers().add(new RecordHeader(KafkaHeaders.CORRELATION_ID, correlationId));

            kafkaTemplate.send(responseRecord);
            log.info("UserServiceConsumerImpl::listenForJoinedEventsByUserRequestEvent: sent response to user-service for user with id : {}", userId);

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
    }
}
