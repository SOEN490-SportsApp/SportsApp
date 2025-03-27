package app.sportahub.userservice.service.kafka.consumer;

import java.time.Instant;
import java.util.UUID;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.user.UserEvent;
import app.sportahub.kafkevents.user.UserFetchEvent;
import app.sportahub.kafkevents.user.UserFetchedEvent;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@AllArgsConstructor
public class OrchestrationServiceConsumerImpl {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final UserRepository userRepository;

    @KafkaListener(topics = UserEvent.FETCH_TOPIC, groupId = "OrchestrationServiceKafkaConsumer")
    public void handleEventsByUserRequest(
        @Payload UserFetchEvent fetchEvent,
        @Header(KafkaHeaders.CORRELATION_ID) byte[] correlationId) {

            log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: received fetch request for user with id: {}", fetchEvent.getUserId());

            String userId = fetchEvent.getUserId();
            User user = userRepository.findById(userId).orElse(null);
            log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: fetched user {}", user);
            
            ObjectMapper objectMapper = new ObjectMapper();
            String userJsonString;
            try {
                userJsonString = objectMapper.writeValueAsString(user);
            } catch (JsonProcessingException e) {
                log.error("Error serializing user object to JSON", e);
                userJsonString = "{}"; // Default to empty JSON object
            }

            log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: response: {}", userJsonString);

            BaseEvent responseBaseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "response",
                "user-service",
                Instant.now(),
                fetchEvent.getBaseEvent().getCorrelationId()
            );

            UserFetchedEvent fetchedEvent = new UserFetchedEvent(responseBaseEvent, userJsonString);
            ProducerRecord<String, Object> responseRecord = new ProducerRecord<>(UserEvent.FETCHED_TOPIC, fetchedEvent);
            responseRecord.headers().add(new RecordHeader(KafkaHeaders.CORRELATION_ID, correlationId));
            kafkaTemplate.send(responseRecord);
            log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: sent user with id: {}", fetchEvent.getUserId());
        }
}
