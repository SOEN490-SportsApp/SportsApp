package app.sportahub.eventservice.service.kafka.producer;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.errors.TimeoutException;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.requestreply.RequestReplyFuture;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.user.UserEvent;
import app.sportahub.kafkevents.user.UserRequestEvent;
import app.sportahub.kafkevents.user.UserResponseEvent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final ReplyingKafkaTemplate<String, Object, Object> replyingKafkaTemplate;

    @SneakyThrows
    @Override
    public String getUserById(String userId) {
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "event-service",
                Instant.now(),
                UUID.randomUUID().toString()
        );

        try{
            UserRequestEvent userRequestEvent = new UserRequestEvent(baseEvent, userId);
            
            ProducerRecord<String, Object> record = new ProducerRecord<>(
                    UserEvent.REQUEST_TOPIC,
                    userRequestEvent
            );
            record.headers().add(KafkaHeaders.REPLY_TOPIC, UserEvent.RESPONSE_TOPIC.getBytes());
            
            RequestReplyFuture<String, Object, Object> future = replyingKafkaTemplate.sendAndReceive(record);
            log.info("OrchestrationServiceProducerImpl::getUserById: sent request for user with id: {}", userRequestEvent.getUserId());
            
            SendResult<String, Object> sendResult = future.getSendFuture().get();
            sendResult.getProducerRecord().headers().forEach(header -> log.info("OrchestrationServiceProducerImpl::getUserById: header key: {}, header value: {}", header.key(), header.value()));
            
            ConsumerRecord<String, Object> response = future.get(15, TimeUnit.SECONDS);
            log.info("OrchestrationServiceProducerImpl::getUserById: received response for user with id: {}", userRequestEvent.getUserId());

            if(response.value() instanceof UserResponseEvent userResponseEvent 
                && Objects.equals(userResponseEvent.getBaseEvent().getCorrelationId(), userRequestEvent.getBaseEvent().getCorrelationId())){
                log.info("OrchestrationServiceImpl::getUserById: response is of type UserResponseEvent: {}", response.value());
                
                return userResponseEvent.getUser();    
            }
            else{
                log.info("OrchestrationServiceImpl::getUserById: response is not of type UserResponseEvent: {}", response.value());
                return null;
            }

        } catch (InterruptedException e) {
            log.error(e.getMessage());
        } catch (ExecutionException e) {
            log.error(e.getMessage());
        } catch (TimeoutException e) {
            log.error(e.getMessage());
            log.error(e.getCause().getMessage());
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return "{}";
    }
}