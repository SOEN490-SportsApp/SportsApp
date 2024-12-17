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

    /**
     * Updates an existing event with the specified ID. This method performs a full update,
     * replacing all fields of the event with those provided in the {@link EventRequest}.
     *
     * @param id           the unique identifier of the event to update
     * @param eventRequest the new data to update the event with
     * @return an {@link EventResponse} object representing the updated event
     * @throws EventDoesNotExistException if no event with the specified ID is found
     */
    @Override
    public EventResponse updateEvent(String id, EventRequest eventRequest) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id));

        Event updatedEvent = eventMapper.eventRequestToEvent(eventRequest)
                .toBuilder()
                .withId(id)
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now())).build();

        Event savedEvent = eventRepository.save(updatedEvent);
        log.info("EventServiceImpl::updateEvent: Event with id:{} was updated", savedEvent.getId());

        return eventMapper.eventToEventResponse(savedEvent);
    }

    /**
     * Partially updates an existing event with the specified ID. This method updates only
     * the fields provided in the {@link EventRequest}, leaving all other fields unchanged.
     *
     * @param id           the unique identifier of the event to patch
     * @param eventRequest the partial data to update the event with
     * @return an {@link EventResponse} object representing the patched event
     * @throws EventDoesNotExistException if no event with the specified ID is found
     */
    @Override
    public EventResponse patchEvent(String id, EventRequest eventRequest) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id));

        eventMapper.patchEventFromRequest(eventRequest, event);
        event.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        Event savedEvent = eventRepository.save(event);
        log.info("EventServiceImpl::patchEvent: Event with id:{} was patched", savedEvent.getId());

        return eventMapper.eventToEventResponse(savedEvent);
    }

    /**
     * Deletes an event from the database using the event id
     * @param id The id of the event to be deleted
     * @throws EventDoesNotExistException if there is no event associated with the provided id
     */
    @Override
    public void deleteEvent(String id) {

        Event evt = eventRepository.findEventById(id).orElseThrow(() -> new EventDoesNotExistException(id));
        eventRepository.delete(evt);
        log.info("deleteEvent: Event with id: {} was successfully deleted", id);


    }
}