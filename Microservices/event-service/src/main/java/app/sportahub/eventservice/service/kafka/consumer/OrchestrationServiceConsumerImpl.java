package app.sportahub.eventservice.service.kafka.consumer;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserFetchEvent;
import app.sportahub.kafkevents.JoinedSportEventEvent.JoinedEventsByUserFetchedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceConsumerImpl implements OrchestrationServiceConsumer {

    //private final ReplyingKafkaTemplate<String, Object, Object> replyingKafkaTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final EventRepository eventRepository;

    @KafkaListener(topics = JoinedEventsByUserEvent.FETCH_TOPIC, groupId = "OrchestrationServiceKafkaConsumer")
    public void handleEventsByUserRequest(
            @Payload JoinedEventsByUserFetchEvent fetchEvent,
            @Header(KafkaHeaders.CORRELATION_ID) byte[] correlationId) {
        log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: fetch topic received");

        String correlationIdStr = new String(correlationId);
        log.info("Received request with correlationId: {}", correlationIdStr);

        String userId = fetchEvent.getEmail();

        List<String> eventIds = eventRepository.findAllByParticipantUserId(userId)
                .stream()
                .map(Event::getId)
                .collect(Collectors.toList());

        log.info("eventIds: {}", eventIds);

        BaseEvent responseBaseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "response",
                "event-service",
                Instant.now(),
                correlationIdStr
        );

        JoinedEventsByUserFetchedEvent fetchedEvent = new JoinedEventsByUserFetchedEvent(responseBaseEvent, eventIds);

        // Manually produce the response
        ProducerRecord<String, Object> responseRecord = new ProducerRecord<>(JoinedEventsByUserEvent.FETCHED_TOPIC, fetchedEvent);
        responseRecord.headers().add(new RecordHeader(KafkaHeaders.CORRELATION_ID, correlationId));
        log.info("corr: {}",correlationId);
        kafkaTemplate.send(responseRecord);

//        replyingKafkaTemplate.send(JoinedEventsByUserEvent.FETCHED_TOPIC, fetchedEvent);
//        kafkaTemplate.send(JoinedEventsByUserEvent.FETCHED_TOPIC, fetchedEvent);

//        kafkaTemplate.send("joined-events-by-user.fetched", fetchedEvent)
//                .thenAccept(result -> {
//                    if (result != null) {
//                        // Add the correlation ID to the reply message
//                        result.getProducerRecord().headers().add(
//                                KafkaHeaders.CORRELATION_ID,
//                                correlationId // Use the correlation ID from the request
//                        );
//                        log.info("EventService: Sent fetched events for user {} with correlationId {}", fetchEvent.getEmail(), new String(correlationId, StandardCharsets.UTF_8));
//                    }
//                })
//                .exceptionally(ex -> {
//                    log.error("EventService: Failed to send fetched events for user {}", fetchEvent.getEmail(), ex);
//                    return null;
//                });

//        replyingKafkaTemplate.executeInTransaction(template -> {
//            template.send(JoinedEventsByUserEvent.FETCHED_TOPIC, fetchedEvent);
//            return Collections.<String> emptyList();
//        });
//        log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: fetched topic sent");

        // Send response to orchestration-service
//        replyingKafkaTemplate.send(JoinedEventsByUserEvent.FETCHED_TOPIC, fetchedEvent);
//        log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: fetched topic sent");
    }

}
