package app.sportahub.eventservice.service.event;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.request.event.ParticipantRequest;
import app.sportahub.eventservice.dto.request.event.ReactionRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.EventState;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.exception.event.EventAlreadyCancelledException;
import app.sportahub.eventservice.exception.event.EventAlreadyExistsException;
import app.sportahub.eventservice.exception.event.EventAlreadyStartedException;
import app.sportahub.eventservice.exception.event.EventCreatorCannotLeaveEventException;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.exception.event.EventFullException;
import app.sportahub.eventservice.exception.event.EventRegistrationClosedException;
import app.sportahub.eventservice.exception.event.EventsNotFoundException;
import app.sportahub.eventservice.exception.event.InvalidReactionException;
import app.sportahub.eventservice.exception.event.ReactionAlreadySubmittedException;
import app.sportahub.eventservice.exception.event.UserAlreadyParticipantException;
import app.sportahub.eventservice.exception.event.UserIsNotEventWhitelistedException;
import app.sportahub.eventservice.exception.event.UserNotAParticipantException;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.EventCancellation;
import app.sportahub.eventservice.model.event.participant.Participant;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.model.event.reactor.Reaction;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.repository.event.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


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
     * Returns either a paginated list or a regular list of EventResponse objects that are within a certain radius of a given location.
     *
     * @param longitude the longitude of the location to search around
     * @param latitude the latitude of the location to search around
     * @param radius the radius around the location to search within
     * @param radiusExpansion whether to expand the radius if no events are found
     * @param paginate whether to return a paginated list or not
     * @param page the page number to return if paginated
     * @param size the number of events per page if paginated
     *
     * @return a {@Link Pageable}  or {@Link List} of {@Link EventResponse} objects
     * @throws EventsNotFoundException if no events are found within the specified radius
    */
    @Override
    public ResponseEntity<?> getRelevantEvents(double longitude, double latitude ,double radius, boolean radiusExpansion, boolean paginate, int page, int size){

        GeoJsonPoint point = new GeoJsonPoint(longitude, latitude);
        Distance distance = new Distance(radius, Metrics.KILOMETERS);
        Pageable pageable =  paginate ? PageRequest.of(page, size) : Pageable.unpaged();

        Page<Event> events = eventRepository.findByLocationCoordinatesNear(point, distance, pageable);

        while(events.isEmpty() && radius < 100 && radiusExpansion){
            radius = radius*2;
            distance = new Distance(radius, Metrics.KILOMETERS);
            events = eventRepository.findByLocationCoordinatesNear(point, distance, pageable);
        }

        if(events.isEmpty()){
            throw new EventsNotFoundException();
        }

        return ResponseEntity.ok(paginate ? events.map(eventMapper::eventToEventResponse):
                events.getContent().stream().map(eventMapper::eventToEventResponse).toList());
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

        List<ReactionRequest> reactionRequests = eventRequest.reactors();
        if (reactionRequests == null) {
            reactionRequests = new ArrayList<>();
        }

        Event event = eventMapper.eventRequestToEvent(eventRequest)
                .toBuilder()
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withParticipants(participants)
                .withReactions(new ArrayList<>())
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
     * Checks if a user is a participant of a specific event.
     * <p>
     * This method retrieves the event by its ID and throws an exception if the event does not exist.
     * If the event is found, it checks whether the user with the given user ID is part of the event's participant list.
     * </p>
     *
     * @param eventId The ID of the event to check for participant membership
     * @param userId  The ID of the user to verify as a participant of the event
     * @return {@code true} if the user is a participant of the event; {@code false} otherwise
     * @throws EventDoesNotExistException if no event is found with the given {@code eventId}
     */
    @Override
    public boolean isParticipant(String eventId, String userId) {
        return eventRepository.findById(eventId)
                .map(event -> event.getParticipants().stream()
                        .anyMatch(participant ->
                                participant.getUserId().equals(userId)
                                        && participant.getAttendStatus() != ParticipantAttendStatus.CANCELLED))
                .orElseThrow(() -> new EventDoesNotExistException(eventId));
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
     * Allows a user to leave an event.
     *
     * <p>
     * This method checks if the specified event exists and if the user is a registered participant.
     * If the event has already started, the user cannot leave. If the event's cut-off time has passed,
     * the user's attendance status is updated to {@code CANCELLED} instead of removing them.
     * Otherwise, the user is removed from the participant list.
     * </p>
     *
     * @param eventId The unique identifier of the event the user wants to leave.
     * @param userId  The unique identifier of the user leaving the event.
     * @return A {@link ParticipantResponse} containing the user's ID, updated attendance status,
     * and the date they joined the event.
     * @throws EventDoesNotExistException   if the event does not exist.
     * @throws UserNotAParticipantException if the user is not registered as a participant in the event.
     * @throws EventAlreadyStartedException if the event has already started.
     */
    @Override
    public ParticipantResponse leaveEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventDoesNotExistException(eventId));

        Participant leavingParticipant = event.getParticipants()
                .stream()
                .filter(participant -> participant.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new UserNotAParticipantException(eventId, userId));

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime cutOffDateTime = LocalDateTime.parse(event.getCutOffTime());

        if (userId.equals(event.getCreatedBy()))
            throw new EventCreatorCannotLeaveEventException(eventId, userId);

        if (event.getDate().isBefore(currentDate) ||
                (event.getDate().isEqual(currentDate) && event.getStartTime().isBefore(currentTime)))
            throw new EventAlreadyStartedException(eventId);

        if (cutOffDateTime.isBefore(currentDateTime)) {
            leavingParticipant.setAttendStatus(ParticipantAttendStatus.CANCELLED);
        } else {
            event.getParticipants().removeIf(p -> p.getUserId().equals(userId));
            leavingParticipant.setAttendStatus(ParticipantAttendStatus.LEFT);
        }

        eventRepository.save(event);
        log.info("EventServiceImpl::leaveEvent: User with id:{} left event with id:{}", userId, eventId);
        return new ParticipantResponse(
                leavingParticipant.getUserId(),
                leavingParticipant.getAttendStatus(),
                leavingParticipant.getJoinedOn()
        );
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

    /**
     * Cancels an event by updating its state to {@code CANCELLED}.
     * This method ensures that only the event creator or an admin can cancel an event.
     * If the event is already cancelled, an exception is thrown.
     *
     * @param eventId       the unique identifier of the event to be cancelled
     * @param cancelRequest contains the reason for cancellation
     * @return an {@link EventResponse} representing the updated event
     * @throws EventDoesNotExistException     if no event with the given ID exists
     * @throws EventAlreadyCancelledException if the event is already cancelled
     */
    @Override
    public EventResponse cancelEvent(String eventId, EventCancellationRequest cancelRequest) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventDoesNotExistException(eventId));

        if (event.getState() == EventState.CANCELLED) {
            throw new EventAlreadyCancelledException(eventId);
        }

        event.setState(EventState.CANCELLED);
        event.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        EventCancellation cancellation = EventCancellation.builder()
                .cancelledBy(authentication.getName())
                .reason(cancelRequest.reason())
                .cancelledAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        event.setCancellation(cancellation);

        Event savedEvent = eventRepository.save(event);
        log.info("EventServiceImpl::cancelEvent: Event with id:{} was cancelled by user:{}", eventId,
                authentication.getName());
        return eventMapper.eventToEventResponse(savedEvent);
    }

    @Override
    public Page<EventResponse> searchEvents(String eventName, String eventType, String sportType, Location location, LocalDate date, LocalTime startTime, LocalTime endTime, String duration, Integer maxParticipants, String createdBy, Boolean isPrivate, List<String> requiredSkillLevel, Pageable pageable) {
        if (eventName == null &&
                eventType == null &&
                sportType == null &&
                location == null &&
                date == null &&
                startTime == null &&
                endTime == null &&
                duration == null &&
                maxParticipants == null &&
                createdBy == null &&
                isPrivate == null &&
                requiredSkillLevel == null) {
            throw new NoSearchCriteriaProvidedException();
        }
        log.info("UserServiceImpl::searchUsers: User created a search query");
        Page<Event> events = eventRepository.searchEvent(eventName, eventType, sportType, location, date, startTime, endTime, duration, maxParticipants, createdBy, isPrivate, requiredSkillLevel, pageable);

        List<EventResponse> eventResponses = events.stream()
                .map(eventMapper::eventToEventResponse).toList();

        return new PageImpl<>(eventResponses, events.getPageable(), events.getTotalElements());
    }



    @Override
    public ReactionResponse reactToEvent(String eventId, ReactionType newReaction) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        if(!(newReaction == ReactionType.NO_REACTION || newReaction == ReactionType.LIKE)){
            throw new InvalidReactionException();
        }

        Event event = eventRepository.findEventById(eventId)
                .orElseThrow(() -> new EventDoesNotExistException(eventId));

        Optional<Reaction> reactorToEventOpt = event.getReactions()
                .stream()
                .filter(reaction -> reaction.getUserId().equals(userId))
                .findFirst();

        Reaction reaction = new Reaction();

        if(reactorToEventOpt.isPresent()) {
            Reaction reactorToEvent = reactorToEventOpt.get();

            if (newReaction == ReactionType.NO_REACTION) {
                reaction = Reaction.builder()
                        .withUserId(userId)
                        .withReactionType(ReactionType.NO_REACTION)
                        .build();
                event.getReactions().remove(reactorToEvent);
            } else {
               throw new ReactionAlreadySubmittedException(eventId, userId);
            }
        } else {
            if(newReaction == ReactionType.LIKE) {
                reaction = Reaction.builder()
                        .withUserId(userId)
                        .withReactionType(ReactionType.LIKE)
                        .build();
                event.getReactions().add(reaction);
            } else{
                throw new ReactionAlreadySubmittedException(eventId, userId);
            }
        }

        eventRepository.save(event);
        log.info("EventServiceImpl::reactToEvent: Event with id: {} reaction: {}", eventId, newReaction);
        return new ReactionResponse( reaction.getUserId(), reaction.getReactionType());
    }
}
