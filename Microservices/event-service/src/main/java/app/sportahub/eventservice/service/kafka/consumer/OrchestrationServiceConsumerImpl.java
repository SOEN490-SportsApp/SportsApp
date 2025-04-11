package app.sportahub.eventservice.service.kafka.consumer;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.kafka.events.BaseEvent;
import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.joinsporteventevent.JoinedEventsByUserFetchEvent;
import app.sportahub.kafka.events.joinsporteventevent.JoinedEventsByUserFetchedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceConsumerImpl implements OrchestrationServiceConsumer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final EventRepository eventRepository;

    @KafkaListener(topics = SportaKafkaEvents.FETCH_TOPIC, groupId = "OrchestrationServiceKafkaConsumer")
    public void handleEventsByUserRequest(
            @Payload JoinedEventsByUserFetchEvent fetchEvent,
            @Header(KafkaHeaders.CORRELATION_ID) byte[] correlationId) {
        log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: received fetch request for event ids for user with id: {}", fetchEvent.getUserId());

        String userId = fetchEvent.getUserId();

        List<String> eventIds = eventRepository.findByParticipantsUserId(userId)
                .stream()
                .map(Event::getId)
                .collect(Collectors.toList());

        BaseEvent responseBaseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "response",
                "event-service",
                Instant.now(),
                fetchEvent.getBaseEvent().getCorrelationId()
        );

        JoinedEventsByUserFetchedEvent fetchedEvent = new JoinedEventsByUserFetchedEvent(responseBaseEvent, eventIds);
        ProducerRecord<String, Object> responseRecord = new ProducerRecord<>(SportaKafkaEvents.FETCHED_TOPIC, fetchedEvent);
        responseRecord.headers().add(new RecordHeader(KafkaHeaders.CORRELATION_ID, correlationId));
        kafkaTemplate.send(responseRecord);
        log.info("OrchestrationServiceConsumerImpl::handleEventsByUserRequest: sent event ids for user with id: {}", fetchEvent.getUserId());
    }

}
