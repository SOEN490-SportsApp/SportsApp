package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
    private Participant participant;

    @BeforeEach
    void setUp() {
        participant = Participant.builder()
                .withUserId("user123")
                .withAttendStatus(ParticipantAttendStatus.JOINED)
                .withJoinedOn(LocalDateTime.now().toLocalDate())
                .build();

        event = Event.builder()
                .withId("1")
                .withEventName("Basketball Game")
                .withMaxParticipants(10)
                .withParticipants(Collections.singletonList(participant))
                .withCreatedBy("creatorId")
                .withIsPrivate(false)
                .withCutOffTime(LocalDateTime.now().plusDays(1).toString())
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
                "creatorId",
                Collections.emptyList(),
                "14:00",
                "Friendly game",
                false,
                null,
                null
        );

        eventRequest = new EventRequest(
                "Basketball Practice",
                "Public",
                "Basketball",
                null,
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
        event.setStartTime(LocalTime.now().plusHours(1));
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
}
