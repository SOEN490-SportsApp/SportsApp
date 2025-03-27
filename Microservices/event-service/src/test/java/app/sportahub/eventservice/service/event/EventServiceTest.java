package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.request.event.LocationRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.EventState;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.exception.event.*;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.participant.Participant;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.model.event.reactor.Reaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMapper eventMapper;

    @InjectMocks
    private EventServiceImpl eventServiceImpl;

    private Event event;
    private EventResponse eventResponse;
    private EventRequest eventRequest;
    private EventCancellationRequest cancelRequest;
    private Participant participant;

    @BeforeEach
    void setUp() {
        cancelRequest = new EventCancellationRequest("Weather conditions");

        LocationRequest locationRequest = new LocationRequest(
                "Parc Lafontaine",
                "3819",
                "Av. Calixa-Lavallée",
                "Montréal",
                "Québec",
                "Canada",
                "H2H 1P4",
                null,
                null,
                new GeoJsonPoint(45.52757745329691, -73.57033414232836)
        );

        Location location = new Location(locationRequest.name(), locationRequest.streetNumber(),
                locationRequest.streetName(), locationRequest.city(), locationRequest.province(),
                locationRequest.country(), locationRequest.postalCode(), locationRequest.addressLine2(),
                locationRequest.phoneNumber(), locationRequest.coordinates());
        participant = Participant.builder()
                .withUserId("user123")
                .withAttendStatus(ParticipantAttendStatus.JOINED)
                .withJoinedOn(LocalDateTime.now().toLocalDate())
                .build();

        event = Event.builder()
                .withId("1")
                .withEventName("Basketball Game")
                .withLocation(location)
                .withMaxParticipants(10)
                .withParticipants(Collections.singletonList(participant))
                .withCreatedBy("creatorId")
                .withIsPrivate(false)
                .withCutOffTime(LocalDateTime.now().plusDays(1).toString())
                .withState(EventState.ACTIVE)
                .build();

        eventResponse = new EventResponse(
                "1",
                Timestamp.valueOf(LocalDateTime.now()),
                "Basketball Game",
                "Sports",
                "Basketball",
                null,
                LocalDateTime.now().toLocalDate(),
                LocalDateTime.now().toLocalTime(),
                LocalDateTime.now().toLocalTime().plusHours(2),
                "2 hours",
                10,
                Collections.emptyList(),
                Collections.emptyList(),
                "creatorId",
                Collections.emptyList(),
                "14:00",
                "Friendly game",
                false,
                null,
                null,
                new ArrayList<>(),
                null
        );

        eventRequest = new EventRequest(
                "Basketball Practice",
                "Public",
                "Basketball",
                locationRequest,
                LocalDateTime.now().toLocalDate(),
                LocalDateTime.now().toLocalTime(),
                LocalDateTime.now().toLocalTime().plusHours(2),
                "2 hours",
                5,
                null,
                "creatorId",
                null,
                "14:00",
                "Practice game",
                true,
                null,
                null,
                null
        );
    }

    @Test
    void getEventByIdShouldReturnEventResponse() {
        when(eventRepository.findEventById(anyString())).thenReturn(Optional.of(event));
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        EventResponse response = eventServiceImpl.getEventById("1");

        assertEquals(eventResponse, response);
        verify(eventRepository, times(1)).findEventById("1");
    }

    @Test
    void getEventByIdShouldThrowEventDoesNotExistException() {
        when(eventRepository.findEventById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.getEventById("1"));
    }

    @Test
    void getAllEventsShouldReturnListOfEvents() {
        when(eventRepository.findAll()).thenReturn(Collections.singletonList(event));
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        List<EventResponse> events = eventServiceImpl.getAllEvents();

        assertFalse(events.isEmpty());
        assertEquals(1, events.size());
        assertEquals(eventResponse, events.get(0));
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getRelevantEventsShouldReturnEventsPage() {
        when(eventRepository.findByLocationCoordinatesNear(any(GeoJsonPoint.class), any(Distance.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(event)));
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        ResponseEntity<?> eventsResponse =  eventServiceImpl.getRelevantEvents(0, 0, 25, false, true, 0, 5);
        Object events = eventsResponse.getBody();
        assertTrue(events instanceof Page);
        assertNotNull(events);
        Page<EventResponse> eventsPage = (Page<EventResponse>) events;
        assertFalse(eventsPage.isEmpty());
        assertEquals(1, eventsPage.getTotalElements());
        assertEquals(eventResponse, eventsPage.getContent().get(0));
        verify(eventRepository, times(1)).findByLocationCoordinatesNear(any(GeoJsonPoint.class), any(Distance.class), any(Pageable.class));
    }

    @Test
    void getRelevantEventsShouldReturnEventsList() {
        when(eventRepository.findByLocationCoordinatesNear(any(GeoJsonPoint.class), any(Distance.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(event)));
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        ResponseEntity<?> eventsResponse = eventServiceImpl.getRelevantEvents(0, 0, 25, false, false, 0, 5);
        Object events = eventsResponse.getBody();
        assertTrue(events instanceof List);
        assertNotNull(events);
        List<EventResponse> eventList;
        if (events instanceof List<?>) {
            eventList = ((List<?>) events).stream()
                    .filter(EventResponse.class::isInstance)
                    .map(EventResponse.class::cast)
                    .collect(Collectors.toList());
        } else {
            throw new ClassCastException("Expected a List<EventResponse>");
        }
        assertEquals(1, eventList.size());
        assertEquals(eventResponse, eventList.get(0));
        verify(eventRepository, times(1)).findByLocationCoordinatesNear(any(GeoJsonPoint.class), any(Distance.class), any(Pageable.class));
    }

    @Test
    void getRelevantEventsShouldExpandRadiusAndReturnEvents() {
        GeoJsonPoint point = new GeoJsonPoint(0, 0);
        Distance initialDistance = new Distance(25, Metrics.KILOMETERS);
        Distance expandedDistance = new Distance(50, Metrics.KILOMETERS);
        Pageable pageable = PageRequest.of(0, 5);

        when(eventRepository.findByLocationCoordinatesNear(eq(point), eq(initialDistance), eq(pageable)))
                .thenReturn(Page.empty());
        when(eventRepository.findByLocationCoordinatesNear(eq(point), eq(expandedDistance), eq(pageable)))
                .thenReturn(new PageImpl<>(Collections.singletonList(event)));
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        ResponseEntity<?> eventsResponse = eventServiceImpl.getRelevantEvents(0, 0, 25, true, true, 0, 5);
        Object events = eventsResponse.getBody();
        assertTrue(events instanceof Page);
        assertNotNull(events);
        Page<EventResponse> eventsPage = (Page<EventResponse>) events;
        assertFalse(eventsPage.isEmpty());
        assertEquals(1, eventsPage.getTotalElements());
        assertEquals(eventResponse, eventsPage.getContent().get(0));
        verify(eventRepository, times(1)).findByLocationCoordinatesNear(eq(point), eq(initialDistance), eq(pageable));
        verify(eventRepository, times(1)).findByLocationCoordinatesNear(eq(point), eq(expandedDistance), eq(pageable));
    }

    @Test
    void createEventShouldSuccessfullyCreateEvent() {
        when(eventRepository.findEventByEventName(anyString())).thenReturn(Optional.empty());
        when(eventMapper.eventRequestToEvent(any(EventRequest.class))).thenReturn(event);
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        EventResponse response = eventServiceImpl.createEvent(eventRequest);

        assertNotNull(response);
        assertEquals(eventResponse, response);
        verify(eventRepository, times(1)).findEventByEventName(eventRequest.eventName());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void createEventShouldThrowEventAlreadyExistsException() {
        when(eventRepository.findEventByEventName(anyString())).thenReturn(Optional.of(event));

        assertThrows(EventAlreadyExistsException.class, () -> eventServiceImpl.createEvent(eventRequest));
    }

    @Test
    void updateEventShouldSuccessfullyUpdateEvent() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));
        when(eventMapper.eventRequestToEvent(any(EventRequest.class))).thenReturn(event);
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        EventResponse response = eventServiceImpl.updateEvent("1", eventRequest);

        assertEquals(eventResponse, response);
        verify(eventRepository, times(1)).findById("1");
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void updateEventShouldThrowEventDoesNotExistException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.updateEvent("1", eventRequest));
    }

    @Test
    void patchEventShouldSuccessfullyPatchEvent() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));
        doNothing().when(eventMapper).patchEventFromRequest(any(EventRequest.class), any(Event.class));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        EventResponse response = eventServiceImpl.patchEvent("1", eventRequest);

        assertEquals(eventResponse, response);
        verify(eventRepository, times(1)).findById("1");
        verify(eventMapper, times(1)).patchEventFromRequest(any(EventRequest.class), any(Event.class));
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void patchEventShouldThrowEventDoesNotExistException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.patchEvent("1", eventRequest));
    }

    @Test
    void deleteEventShouldSuccessfullyDeleteEvent() {
        when(eventRepository.findEventById(anyString())).thenReturn(Optional.of(event));
        doNothing().when(eventRepository).delete(any(Event.class));

        eventServiceImpl.deleteEvent("1");

        verify(eventRepository, times(1)).findEventById("1");
        verify(eventRepository, times(1)).delete(any(Event.class));
    }

    @Test
    void deleteEventShouldThrowEventDoesNotExistException() {
        when(eventRepository.findEventById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.deleteEvent("1"));
    }

    @Test
    void isCreatorShouldReturnTrueWhenUserIsCreator() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        boolean isCreator = eventServiceImpl.isCreator("1", "creatorId");

        assertTrue(isCreator);
        verify(eventRepository, times(1)).findById("1");
    }

    @Test
    void isCreatorShouldReturnFalseWhenUserIsNotCreator() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        boolean isCreator = eventServiceImpl.isCreator("1", "otherUserId");

        assertFalse(isCreator);
        verify(eventRepository, times(1)).findById("1");
    }

    @Test
    void isCreatorShouldThrowEventDoesNotExistException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.isCreator("1", "creatorId"));
        verify(eventRepository, times(1)).findById("1");
    }

    @Test
    void joinEventShouldSuccessfullyAddParticipantToEvent() {
        event = event.toBuilder()
                .withIsPrivate(false)
                .withCutOffTime(LocalDateTime.now().plusDays(1).toString())
                .withParticipants(new ArrayList<>())
                .withMaxParticipants(10)
                .build();

        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        ParticipantResponse response = eventServiceImpl.joinEvent("1", "newUser");

        assertNotNull(response);
        assertEquals("newUser", response.userId());
        assertEquals(ParticipantAttendStatus.JOINED, response.attendStatus());

        verify(eventRepository, times(1)).findById("1");
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void joinEventShouldAllowWhitelistedUserToJoin() {
        event = event.toBuilder()
                .withIsPrivate(true)
                .withWhitelistedUsers(Collections.singletonList("whitelistedUser"))
                .withParticipants(new ArrayList<>())
                .build();

        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        ParticipantResponse response = eventServiceImpl.joinEvent("1", "whitelistedUser");

        assertNotNull(response);
        assertEquals("whitelistedUser", response.userId());
        verify(eventRepository, times(1)).findById("1");
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void joinEventShouldThrowEventDoesNotExistException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.joinEvent("1", "newUser"));
    }

    @Test
    void joinEventShouldThrowUserIsNotEventWhitelistedException() {
        event = event.toBuilder().withIsPrivate(true).withWhitelistedUsers(Collections.emptyList()).build();
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        assertThrows(UserIsNotEventWhitelistedException.class, () -> eventServiceImpl.joinEvent("1", "newUser"));
    }

    @Test
    void joinEventShouldThrowEventRegistrationClosedException() {
        event = event.toBuilder().withCutOffTime(LocalDateTime.now().minusDays(1).toString()).build();
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        assertThrows(EventRegistrationClosedException.class, () -> eventServiceImpl.joinEvent("1", "newUser"));
    }

    @Test
    void joinEventShouldThrowEventFullException() {
        event = event.toBuilder().withMaxParticipants(1).withParticipants(Collections.singletonList(participant)).build();
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        assertThrows(EventFullException.class, () -> eventServiceImpl.joinEvent("1", "newUser"));
    }

    @Test
    void joinEventShouldThrowUserAlreadyParticipantException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        assertThrows(UserAlreadyParticipantException.class, () -> eventServiceImpl.joinEvent("1", "user123"));
    }

    @Test
    void getEventsByParticipantIdShouldReturnEventsSortedAscending() {
        Page<Event> eventsPage = new PageImpl<>(Collections.singletonList(event));
        when(eventRepository.findByParticipantsUserId(eq("user123"), any(Pageable.class))).thenReturn(eventsPage);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        Page<EventResponse> events = eventServiceImpl.getEventsByParticipantId("user123", 0, 5, SortDirection.ASC,
                EventSortingField.EVENT_NAME);

        assertNotNull(events);
        assertEquals(1, events.getTotalElements());
        verify(eventRepository, times(1)).findByParticipantsUserId(eq("user123"), any(Pageable.class));
    }

    @Test
    void getEventsByParticipantIdShouldReturnEventsSortedDescending() {
        Page<Event> eventsPage = new PageImpl<>(Collections.singletonList(event));
        when(eventRepository.findByParticipantsUserId(eq("user123"), any(Pageable.class))).thenReturn(eventsPage);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        Page<EventResponse> events = eventServiceImpl.getEventsByParticipantId("user123", 0, 5, SortDirection.DESC,
                EventSortingField.EVENT_NAME);

        assertNotNull(events);
        assertEquals(1, events.getTotalElements());
        verify(eventRepository, times(1)).findByParticipantsUserId(eq("user123"), any(Pageable.class));
    }

    @Test
    void getEventsCreatedByUserIdShouldReturnEventsSortedAscending() {
        Page<Event> eventsPage = new PageImpl<>(Collections.singletonList(event));
        when(eventRepository.findByCreatedBy(eq("creatorId"), any(Pageable.class))).thenReturn(eventsPage);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        Page<EventResponse> events = eventServiceImpl.getEventsCreatedByUserId("creatorId", 0, 5, SortDirection.ASC,
                EventSortingField.EVENT_NAME);

        assertNotNull(events);
        assertEquals(1, events.getTotalElements());
        verify(eventRepository, times(1)).findByCreatedBy(eq("creatorId"), any(Pageable.class));
    }

    @Test
    void getEventsCreatedByUserIdShouldReturnEventsSortedDescending() {
        Page<Event> eventsPage = new PageImpl<>(Collections.singletonList(event));
        when(eventRepository.findByCreatedBy(eq("creatorId"), any(Pageable.class))).thenReturn(eventsPage);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        Page<EventResponse> events = eventServiceImpl.getEventsCreatedByUserId("creatorId", 0, 5, SortDirection.DESC,
                EventSortingField.EVENT_NAME);

        assertNotNull(events);
        assertEquals(1, events.getTotalElements());
        verify(eventRepository, times(1)).findByCreatedBy(eq("creatorId"), any(Pageable.class));
    }

    @Test
    void leaveEvent_SuccessfullyLeavesEvent() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";
        LocalDate eventDate = LocalDate.now().plusDays(1);
        LocalDateTime cutOffTime = LocalDateTime.now().plusHours(1);

        Participant participant = new Participant(userId, ParticipantAttendStatus.JOINED, LocalDate.now());
        Event event = new Event();
        event.setId(eventId);
        event.setDate(eventDate);
        event.setCutOffTime(cutOffTime.toString());
        event.setParticipants(new ArrayList<>(List.of(participant)));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        // Act
        ParticipantResponse response = eventServiceImpl.leaveEvent(eventId, userId);

        // Assert
        assertNotNull(response);
        assertEquals(userId, response.userId());
        assertEquals(ParticipantAttendStatus.LEFT, response.attendStatus());
        verify(eventRepository).save(event);
    }

    @Test
    void leaveEvent_EventDoesNotExist_ThrowsException() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";

        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.leaveEvent(eventId, userId));
    }

    @Test
    void leaveEvent_UserNotAParticipant_ThrowsException() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";
        Event event = new Event();
        event.setId(eventId);
        event.setDate(LocalDate.now().plusDays(1));
        event.setCutOffTime(LocalDateTime.now().plusHours(1).toString());
        event.setParticipants(new ArrayList<>());

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        // Act & Assert
        assertThrows(UserNotAParticipantException.class, () -> eventServiceImpl.leaveEvent(eventId, userId));
    }

    @Test
    void leaveEvent_EventAlreadyStarted_ThrowsException() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";
        Event event = new Event();
        event.setId(eventId);
        event.setDate(LocalDate.now().minusDays(1));
        event.setStartTime(LocalTime.now().minusHours(1)); // Event already started
        event.setCutOffTime(LocalDateTime.now().minusDays(2).toString());
        event.setParticipants(new ArrayList<>(List.of(new Participant(userId, ParticipantAttendStatus.JOINED, LocalDate.now()))));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        // Act & Assert
        assertThrows(EventAlreadyStartedException.class, () -> eventServiceImpl.leaveEvent(eventId, userId));
    }

    @Test
    void leaveEvent_CreatorCannotLeave_ThrowsException() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";
        Event event = new Event();
        event.setId(eventId);
        event.setCreatedBy(userId);
        event.setCutOffTime(LocalDateTime.now().toString());
        event.setParticipants(new ArrayList<>(List.of(new Participant(userId, ParticipantAttendStatus.JOINED, LocalDate.now()))));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        // Act & Assert
        assertThrows(EventCreatorCannotLeaveEventException.class, () -> eventServiceImpl.leaveEvent(eventId, userId));
    }

    @Test
    void leaveEvent_AfterCutOffTime_SetsCancelledStatus() {
        // Arrange
        String eventId = "event123";
        String userId = "user456";
        LocalDateTime pastCutOffTime = LocalDateTime.now().minusHours(1);

        Participant participant = new Participant(userId, ParticipantAttendStatus.JOINED, LocalDate.now());
        Event event = new Event();
        event.setId(eventId);
        event.setDate(LocalDate.now().plusDays(1));
        event.setStartTime(LocalTime.now().plusHours(1));
        event.setCutOffTime(pastCutOffTime.toString());
        event.setParticipants(new ArrayList<>(List.of(participant)));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        // Act
        ParticipantResponse response = eventServiceImpl.leaveEvent(eventId, userId);

        // Assert
        assertNotNull(response);
        assertEquals(userId, response.userId());
        assertEquals(ParticipantAttendStatus.CANCELLED, response.attendStatus());
        verify(eventRepository).save(event);
    }

    @Test
    void cancelEventShouldSuccessfullyCancelEvent() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.eventToEventResponse(any(Event.class))).thenReturn(eventResponse);

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("adminUser");
        SecurityContextHolder.setContext(securityContext);

        EventResponse response = eventServiceImpl.cancelEvent("1", cancelRequest);

        assertNotNull(response);
        assertEquals(EventState.CANCELLED, event.getState());
        assertNotNull(event.getCancellation());
        assertEquals("adminUser", event.getCancellation().getCancelledBy());
        assertEquals("Weather conditions", event.getCancellation().getReason());
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void cancelEventShouldThrowEventDoesNotExistException() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class, () -> eventServiceImpl.cancelEvent("1", cancelRequest));
    }

    @Test
    void cancelEventShouldThrowEventAlreadyCancelledException() {
        event.setState(EventState.CANCELLED);
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(event));

        assertThrows(EventAlreadyCancelledException.class, () -> eventServiceImpl.cancelEvent("1", cancelRequest));
    }

    @Test
    void testReactToEvent_LikeEvent_Success() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user456");
        SecurityContextHolder.setContext(securityContext);

        Event event = new Event();
        event.setId("event123");
        event.setReactions(new ArrayList<>());

        when(eventRepository.findEventById("event123")).thenReturn(Optional.of(event));

        ReactionResponse response = eventServiceImpl.reactToEvent("event123",  ReactionType.LIKE);

        assertNotNull(response);
        assertEquals("user456", response.userId());
        assertEquals(ReactionType.LIKE, response.reactionType());
        assertEquals(1, event.getReactions().size());

        verify(eventRepository).findEventById("event123");
    }

    @Test
    void testReactToEvent_RemoveReaction_Success() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user456");
        SecurityContextHolder.setContext(securityContext);

        Event event = new Event();
        event.setId("event123");
        Reaction reactor = new Reaction("user456", ReactionType.LIKE, LocalDateTime.now());
        event.setReactions(new ArrayList<>(List.of(reactor)));

        when(eventRepository.findEventById("event123")).thenReturn(Optional.of(event));

        ReactionResponse response = eventServiceImpl.reactToEvent("event123",  ReactionType.NO_REACTION);

        assertNotNull(response);
        assertEquals("user456", response.userId());
        assertEquals(ReactionType.NO_REACTION, response.reactionType());
        assertEquals(0, event.getReactions().size());

        verify(eventRepository).findEventById("event123");
    }

    @Test
    void testReactToEvent_AlreadyReacted_ThrowsException() {
        Event event = new Event();
        event.setId("event123");
        Reaction reactor = new Reaction("user456", ReactionType.LIKE, LocalDateTime.now());
        event.setReactions(new ArrayList<>(List.of(reactor)));

        when(eventRepository.findEventById("event123")).thenReturn(Optional.of(event));

        assertThrows(ReactionAlreadySubmittedException.class,
                () -> eventServiceImpl.reactToEvent("event123",  ReactionType.LIKE)
        );

        verify(eventRepository).findEventById("event123");
    }

    @Test
    void testReactToEvent_InvalidReaction_ThrowsException() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user456");
        SecurityContextHolder.setContext(securityContext);

        assertThrows(InvalidReactionException.class,
                () -> eventServiceImpl.reactToEvent("event123", null)
        );
    }

    @Test
    void testReactToEvent_EventDoesNotExist_ThrowsException() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user456");
        SecurityContextHolder.setContext(securityContext);

        when(eventRepository.findEventById("event123")).thenReturn(Optional.empty());

        assertThrows(EventDoesNotExistException.class,
                () -> eventServiceImpl.reactToEvent("event123", ReactionType.LIKE)
        );

        verify(eventRepository).findEventById("event123");
    }
}
