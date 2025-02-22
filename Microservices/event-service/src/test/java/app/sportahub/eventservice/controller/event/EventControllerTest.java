package app.sportahub.eventservice.controller.event;

import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.LocationResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.service.event.EventService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventControllerTest {

    @InjectMocks
    private EventController eventController;

    @Mock
    private EventService eventService;

    private EventResponse eventResponse;
    private EventRequest eventRequest;
    private EventCancellationRequest cancelRequest;
    private ParticipantResponse participantResponse;
    private ReactionResponse reactionResponse;

    @BeforeEach
    public void setUp() {
        cancelRequest = new EventCancellationRequest("Weather conditions");
        eventResponse = new EventResponse(
                "1",
                Timestamp.valueOf("2023-01-01 10:00:00"),
                "Basketball Tournament",
                "Sports",
                "Basketball",
                null,
                LocalDate.of(2023, 12, 1),
                LocalTime.of(15, 0),
                LocalTime.of(17, 0),
                "2 hours",
                10,
                Collections.emptyList(),
                Collections.emptyList(),
                "User123",
                Collections.emptyList(),
                "14:00",
                "Join us for a friendly match!",
                false,
                List.of("User111", "User222"),
                EnumSet.of(SkillLevelEnum.BEGINNER, SkillLevelEnum.INTERMEDIATE),
                null,
                 null
        );


        eventRequest = new EventRequest(
                "Basketball Practice",
                "Public",
                "Basketball",
                null,
                LocalDate.of(2023, 11, 30),
                LocalTime.of(18, 0),
                LocalTime.of(20, 0),
                "2 hours",
                5,
                null,
                "User321",
                null,
                "17:30",
                "Let's practice together!",
                true,
                List.of("User111"),
                EnumSet.of(SkillLevelEnum.INTERMEDIATE),
                null
        );


        participantResponse = new ParticipantResponse(
                "User999",
                ParticipantAttendStatus.JOINED,
                LocalDate.now()
        );
    }

    @Test
    public void testGetEventById() {
        when(eventService.getEventById(anyString())).thenReturn(eventResponse);

        EventResponse response = eventController.getEventById("testId");

        assertEquals(eventResponse, response);
        verify(eventService).getEventById("testId");
    }

    @Test
    public void testGetAllEvents() {
        List<EventResponse> eventList = Arrays.asList(eventResponse);
        when(eventService.getAllEvents()).thenReturn(eventList);

        List<EventResponse> response = eventController.getAllEvents();

        assertEquals(eventList, response);
        verify(eventService).getAllEvents();
    }

    @Test
    public void testGetEventsByLocationReturnList() {
        List<EventResponse> eventList = Arrays.asList(eventResponse);
        Mockito.when(eventService.getRelevantEvents(
                any(double.class),
                any(double.class),
                any(double.class),
                any(boolean.class),
                any(boolean.class),
                any(int.class),
                any(int.class)
        )).thenReturn((ResponseEntity) ResponseEntity.ok(eventList));

        ResponseEntity<?> response = eventController.getEventsByLocation(-74.0060,40.7128, 25.0, false, false, 0, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventList, response.getBody());
        Mockito.verify(eventService).getRelevantEvents(
                Mockito.eq(-74.0060),
                Mockito.eq(40.7128),
                Mockito.eq(25.0),
                Mockito.eq(false),
                Mockito.eq(false),
                Mockito.eq(0),
                Mockito.eq(10)
        );
    }

    @Test
    public void testGetEventsByLocationReturnPage() {
        Page<EventResponse> eventList = new PageImpl<>(Collections.singletonList(eventResponse));
        Mockito.when(eventService.getRelevantEvents(
                any(double.class),
                any(double.class),
                any(double.class),
                any(boolean.class),
                any(boolean.class),
                any(int.class),
                any(int.class)
        )).thenReturn((ResponseEntity) ResponseEntity.ok(eventList));

        ResponseEntity<?> response = eventController.getEventsByLocation(-74.0060,40.7128, 25.0, false, true, 0, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventList, response.getBody());
        Mockito.verify(eventService).getRelevantEvents(
                Mockito.eq(-74.0060),
                Mockito.eq(40.7128),
                Mockito.eq(25.0),
                Mockito.eq(false),
                Mockito.eq(true),
                Mockito.eq(0),
                Mockito.eq(10)
        );
    }

    @Test
    public void testCreateEvent() {
        when(eventService.createEvent(any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.createEvent(eventRequest);

        assertEquals(eventResponse, response);
        verify(eventService).createEvent(eventRequest);
    }

    @Test
    public void testUpdateEvent() {
        when(eventService.updateEvent(anyString(), any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.updateEvent("testId", eventRequest);

        assertEquals(eventResponse, response);
        verify(eventService).updateEvent("testId", eventRequest);
    }

    @Test
    public void testPatchEvent() {
        when(eventService.patchEvent(anyString(), any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.patchEvent("testId", eventRequest);

        assertEquals(eventResponse, response);
        verify(eventService).patchEvent("testId", eventRequest);
    }

    @Test
    public void testDeleteEvent() {
        eventController.deleteEvent("testId");

        verify(eventService).deleteEvent("testId");
    }

    @Test
    public void testJoinEvent() {
        when(eventService.joinEvent(anyString(), anyString())).thenReturn(participantResponse);

        ParticipantResponse response = eventController.joinEvent("testId", "userId");

        assertEquals(participantResponse, response);
        verify(eventService).joinEvent("testId", "userId");
    }

    @Test
    public void testGetEventsByParticipantId() {
        Page<EventResponse> eventPage = new PageImpl<>(Arrays.asList(eventResponse));
        when(eventService.getEventsByParticipantId(anyString(), any(int.class), any(int.class), any(SortDirection.class), any(EventSortingField.class)))
                .thenReturn(eventPage);

        Page<EventResponse> response = eventController.getEventByUserId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);

        assertEquals(eventPage, response);
        verify(eventService).getEventsByParticipantId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);
    }

    @Test
    public void testGetEventsCreatedByUserId() {
        Page<EventResponse> eventPage = new PageImpl<>(Arrays.asList(eventResponse));
        when(eventService.getEventsCreatedByUserId(anyString(), any(int.class), any(int.class), any(SortDirection.class), any(EventSortingField.class)))
                .thenReturn(eventPage);

        Page<EventResponse> response = eventController.getEventsCreatedByUserId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);

        assertEquals(eventPage, response);
        Mockito.verify(eventService).getEventsCreatedByUserId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);
    }

    @Test
    void testLeaveEvent() {
        Mockito.when(eventService.leaveEvent(anyString(), anyString())).thenReturn(participantResponse);

        ParticipantResponse response = eventController.leaveEvent("testId", "userId");

        assertEquals(participantResponse, response);
        verify(eventService).leaveEvent("testId", "userId");
    }

    @Test
    void testSearchEvents() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        EventResponse eventResponse = new EventResponse(
                "event123",
                null,
                "Soccer Match",
                "Friendly",
                "Soccer",
                new LocationResponse("Central Park", "", "", "New York", "NY", "USA", "10001", "", "", "", ""),
                LocalDate.of(2023, 10, 15),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                "120",
                20,
                Collections.emptyList(), // participants
                "user123",
                Collections.emptyList(), // teams
                "18:00", // cutOffTime
                "A friendly soccer match in Central Park",
                false,
                Collections.emptyList(), // whitelistedUsers
                EnumSet.of(SkillLevelEnum.INTERMEDIATE)
        );
        Page<EventResponse> mockPage = new PageImpl<>(List.of(eventResponse), pageable, 1);

        // Mock the service method
        when(eventService.searchEvents(
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(),
                anyString(), anyString(), anyString(), anyString(), anyString(), anyString(), any(), any(), any()
        )).thenReturn(mockPage);

        // Act
        Page<EventResponse> result = eventController.searchEvents(
                "Soccer Match", // eventName
                "Friendly", // eventType
                "Soccer", // sportType
                "Central Park", // locationName
                "New York", // city
                "NY", // province
                "USA", // country
                "10001", // postalCode
                "2023-10-15", // date
                "14:00", // startTime
                "16:00", // endTime
                "120", // duration
                "20", // maxParticipants
                "user123", // createdBy
                false, // isPrivate
                List.of(SkillLevelEnum.INTERMEDIATE), // requiredSkillLevel
                0, // page
                10 // size
        );

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("event123", result.getContent().getFirst().id());
        assertEquals("Soccer Match", result.getContent().getFirst().eventName());
        assertEquals("Friendly", result.getContent().getFirst().eventType());
        assertEquals("Soccer", result.getContent().getFirst().sportType());
        assertEquals("Central Park", result.getContent().getFirst().locationResponse().name());
        assertEquals("New York", result.getContent().getFirst().locationResponse().city());
        assertEquals("NY", result.getContent().getFirst().locationResponse().province());
        assertEquals("USA", result.getContent().getFirst().locationResponse().country());
        assertEquals("10001", result.getContent().getFirst().locationResponse().postalCode());
        assertEquals(LocalDate.of(2023, 10, 15), result.getContent().getFirst().date());
        assertEquals(LocalTime.of(14, 0), result.getContent().getFirst().startTime());
        assertEquals(LocalTime.of(16, 0), result.getContent().getFirst().endTime());
        assertEquals("120", result.getContent().getFirst().duration());
        assertEquals(20, result.getContent().getFirst().maxParticipants());
        assertEquals("user123", result.getContent().getFirst().createdBy());
        assertEquals("18:00", result.getContent().getFirst().cutOffTime());
        assertEquals("A friendly soccer match in Central Park", result.getContent().getFirst().description());
        Assertions.assertFalse(result.getContent().getFirst().isPrivate());
        assertEquals(EnumSet.of(SkillLevelEnum.INTERMEDIATE), result.getContent().getFirst().requiredSkillLevel());

        // Verify interactions
        verify(eventService).searchEvents(
                "Soccer Match", "Friendly", "Soccer", "Central Park", "New York", "NY", "USA", "10001",
                "2023-10-15", "14:00", "16:00", "120", "20", "user123", false, List.of(SkillLevelEnum.INTERMEDIATE), pageable
        );
    }

    @Test
    public void testCancelEvent() {
        Mockito.when(eventService.cancelEvent(anyString(), any(EventCancellationRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.cancelEvent("testId", cancelRequest);

        assertEquals(eventResponse, response);
        Mockito.verify(eventService).cancelEvent("testId", cancelRequest);
    }

    @Test
    public void testReactToEvent() {
        Mockito.when(eventService.reactToEvent(Mockito.eq("testId"), Mockito.eq(ReactionType.LIKE)))
                .thenReturn(reactionResponse);

        ReactionResponse response = eventController.reactToEvent("testId", ReactionType.LIKE);

        assertEquals(reactionResponse, response);
        Mockito.verify(eventService).reactToEvent(Mockito.eq("testId"), Mockito.eq(ReactionType.LIKE));
    }

}
