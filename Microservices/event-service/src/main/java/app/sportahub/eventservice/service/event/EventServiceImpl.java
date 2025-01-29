package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.request.ParticipantRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.exception.event.*;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.participant.Participant;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service("eventService")
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    /**
     * Returns a specific event with an id matching the provided id.
     *
     * @param id The id of the event we want to return
     * @return an {@link EventResponse} object representing the event that matched the given id
     * @throws EventDoesNotExistException if no event has a matching id
     */
    @Override
    public EventResponse getEventById(String id) {
        return eventMapper.eventToEventResponse(eventRepository.findEventById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id)));
    }

    /**
     * Returns all events in the database.
     *
     * @return a List containing an EventResponse object for each event stored in the database.
     */
    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream().map(eventMapper::eventToEventResponse).toList();
    }

    /**
     * Creates an event with the provided information found in the {@link EventRequest}.
     *
     * @param eventRequest the new data to create the event with
     * @return an {@link EventResponse} object representing the event that was created
     * @throws EventAlreadyExistsException if an event with the same name is created
     */
    @Override
    public EventResponse createEvent(EventRequest eventRequest) {
        eventRepository.findEventByEventName(eventRequest.eventName())
                .ifPresent(event -> {
                    throw new EventAlreadyExistsException(eventRequest.eventName());
                });

        List<ParticipantRequest> participantRequests = eventRequest.participants();
        if (participantRequests == null) {
            participantRequests = new ArrayList<>();
        }
        participantRequests.add(new ParticipantRequest(eventRequest.createdBy(), ParticipantAttendStatus.CONFIRMED, LocalDate.now()));

        List<Participant> participants = participantRequests.stream()
                .map(participantRequest -> new Participant(participantRequest.userId(),
                        participantRequest.attendStatus(),
                         participantRequest.joinedOn())).toList();

        Event event = eventMapper.eventRequestToEvent(eventRequest)
                .toBuilder()
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withParticipants(participants)
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
        eventRepository.findById(id)
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
     * Checks if the user with the specified userId is the creator of the event with
     * the specified id.
     *
     * @param id     the unique identifier of the event
     * @param userId the unique identifier of the user
     * @return true if the user is the creator of the event, false otherwise
     * @throws EventDoesNotExistException if no event with the specified ID is found
     */
    @Override
    public boolean isCreator(String id, String userId) {
        return eventRepository.findById(id)
                .map(event -> event.getCreatedBy().equals(userId))
                .orElseThrow(() -> new EventDoesNotExistException(id));
    }

    /**
     * Deletes an event from the database using the event id
     *
     * @param id The id of the event to be deleted
     * @throws EventDoesNotExistException if there is no event associated with the provided id
     */
    @Override
    public void deleteEvent(String id) {

        Event evt = eventRepository.findEventById(id).orElseThrow(() -> new EventDoesNotExistException(id));
        eventRepository.delete(evt);
        log.info("deleteEvent: Event with id: {} was successfully deleted", id);
    }

    /**
     * Allows a user to join an event if they are eligible and the event is not full.
     *
     * <p>This method retrieves the event by its ID and enforces the following checks:
     * <ul>
     *   <li>Throws an {@link EventDoesNotExistException} if the event with the specified ID does not exist.</li>
     *   <li>Throws a {@link UserIsNotEventWhitelistedException} if the event is private and the user is not whitelisted.</li>
     *   <li>Throws an {@link EventRegistrationClosedException} if the event is past its registration cutoff time.</li>
     *   <li>Throws an {@link EventFullException} if the event has reached its maximum number of participants.</li>
     *   <li>Throws a {@link UserAlreadyParticipantException} if the user is already participating in the event.</li>
     * </ul>
     *
     * <p>If all checks pass, the user is added as a participant to the event, and the updated event
     * is saved to the repository.
     *
     * <p><strong>Note:</strong> This method does not currently verify whether the user
     * exists. User validation will be implemented when inter-service communication is established.
     *
     * @param id     the unique identifier of the event
     * @param userId the unique identifier of the user attempting to join the event
     * @throws EventDoesNotExistException         if the event with the specified ID does not exist
     * @throws UserIsNotEventWhitelistedException if the event is private and the user is not whitelisted
     * @throws EventRegistrationClosedException   if the event is past its registration cutoff time
     * @throws EventFullException                 if the event has reached its maximum number of participants
     * @throws UserAlreadyParticipantException    if the user is already participating in the event
     */
    @Override
    public ParticipantResponse joinEvent(String id, String userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id));

        //TODO: Check if user exists, to be implemented once communications between services are established

        if (event.getIsPrivate() && !event.getWhitelistedUsers().contains(userId)) {
            throw new UserIsNotEventWhitelistedException(id, userId);
        }

        if (LocalDateTime.parse(event.getCutOffTime()).isBefore(LocalDateTime.now())) {
            throw new EventRegistrationClosedException(id);
        }

        if (event.getParticipants().size() >= event.getMaxParticipants()) {
            throw new EventFullException(id, userId);
        }

        boolean isAlreadyParticipant = event.getParticipants().stream()
                .anyMatch(participant -> participant.getUserId().equals(userId));
        if (isAlreadyParticipant) {
            throw new UserAlreadyParticipantException(id, userId);
        }

        Participant participant = Participant.builder()
                .withUserId(userId)
                .withAttendStatus(ParticipantAttendStatus.JOINED)
                .withJoinedOn(LocalDateTime.now().toLocalDate())
                .build();

        event.getParticipants().add(participant);
        eventRepository.save(event);
        log.info("EventServiceImpl::joinEvent: User with id:{} joined event with id:{}", userId, id);
        return new ParticipantResponse(participant.getUserId(), participant.getAttendStatus(),
                participant.getJoinedOn());
    }

    /**
     * Retrieves a paginated list of events that a specific user is participating in.
     *
     * @param userId the unique identifier of the user
     * @param page   the page number to retrieve
     * @param size   the number of events per page
     * @param sort   the direction to sort the events
     * @param field  the field to sort the events by
     * @return a {@link Page} of {@link EventResponse} objects representing the events the user is participating in
     */
    @Override
    public Page<EventResponse> getEventsByParticipantId(String userId, int page, int size, SortDirection sort, EventSortingField field) {
        Sort.Direction direction = sort == SortDirection.ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sorting = Sort.by(Sort.Order.by(field.getFieldName()).with(direction).nullsLast());
        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<Event> events = eventRepository.findByParticipantsUserId(userId, pageable);
        log.info("`EventServiceImpl::getEventsByParticipantId: Retrieved {} events that user {} participated in", events.getNumberOfElements(), userId);
        return events.map(eventMapper::eventToEventResponse);
    }

    /**
     * Retrieves a paginated list of events created by a specific user.
     *
     * @param userId the unique identifier of the user who created the events
     * @param page   the page number to retrieve
     * @param size   the number of events per page
     * @param sort   the direction to sort the events
     * @param field  the field to sort the events by
     * @return a {@link Page} of {@link EventResponse} objects representing the events created by the user
     */
    @Override
    public Page<EventResponse> getEventsCreatedByUserId(String userId, int page, int size, SortDirection sort, EventSortingField field) {
        Sort.Direction direction = sort == SortDirection.ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sorting = Sort.by(Sort.Order.by(field.getFieldName()).with(direction).nullsLast());
        Pageable pageable = PageRequest.of(page, size, sorting);
        Page<Event> events = eventRepository.findByCreatedBy(userId, pageable);
        log.info("EventServiceImpl::getEventsCreatedByUserId: Retrieved {} events created by user {}", events.getNumberOfElements(), userId);
        return events.map(eventMapper::eventToEventResponse);
    }
}
