package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.exception.event.EventAlreadyExistsException;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public EventResponse getEventById(String id) {
        return eventMapper.eventToEventResponse(eventRepository.findEventById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id)));
    }

    @Override
    public EventResponse createEvent(EventRequest eventRequest) {
        eventRepository.findEventByEventName(eventRequest.eventName())
                .ifPresent(event -> {
                    throw new EventAlreadyExistsException(eventRequest.eventName());
                });

        Event event = eventMapper.eventRequestToEvent(eventRequest)
                .toBuilder()
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        Event savedEvent = eventRepository.save(event);
        log.info("EventServiceImpl::createEvent: Event with id: {} was successfully created", savedEvent.getId());
        return eventMapper.eventToEventResponse(savedEvent);
    }
}