package app.sportahub.eventservice.controller.event;

import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.service.event.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
        Mockito.when(eventService.getEventById(anyString())).thenReturn(eventResponse);

        EventResponse response = eventController.getEventById("testId");

        assertEquals(eventResponse, response);
        Mockito.verify(eventService).getEventById("testId");
    }

    @Test
    public void testGetAllEvents() {
        List<EventResponse> eventList = Arrays.asList(eventResponse);
        Mockito.when(eventService.getAllEvents()).thenReturn(eventList);

        List<EventResponse> response = eventController.getAllEvents();

        assertEquals(eventList, response);
        Mockito.verify(eventService).getAllEvents();
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
        Mockito.when(eventService.createEvent(any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.createEvent(eventRequest);

        assertEquals(eventResponse, response);
        Mockito.verify(eventService).createEvent(eventRequest);
    }

    @Test
    public void testUpdateEvent() {
        Mockito.when(eventService.updateEvent(anyString(), any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.updateEvent("testId", eventRequest);

        assertEquals(eventResponse, response);
        Mockito.verify(eventService).updateEvent("testId", eventRequest);
    }

    @Test
    public void testPatchEvent() {
        Mockito.when(eventService.patchEvent(anyString(), any(EventRequest.class))).thenReturn(eventResponse);

        EventResponse response = eventController.patchEvent("testId", eventRequest);

        assertEquals(eventResponse, response);
        Mockito.verify(eventService).patchEvent("testId", eventRequest);
    }

    @Test
    public void testDeleteEvent() {
        eventController.deleteEvent("testId");

        Mockito.verify(eventService).deleteEvent("testId");
    }

    @Test
    public void testJoinEvent() {
        Mockito.when(eventService.joinEvent(anyString(), anyString())).thenReturn(participantResponse);

        ParticipantResponse response = eventController.joinEvent("testId", "userId");

        assertEquals(participantResponse, response);
        Mockito.verify(eventService).joinEvent("testId", "userId");
    }

    @Test
    public void testGetEventsByParticipantId() {
        Page<EventResponse> eventPage = new PageImpl<>(Arrays.asList(eventResponse));
        Mockito.when(eventService.getEventsByParticipantId(anyString(), any(int.class), any(int.class), any(SortDirection.class), any(EventSortingField.class)))
                .thenReturn(eventPage);

        Page<EventResponse> response = eventController.getEventByUserId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);

        assertEquals(eventPage, response);
        Mockito.verify(eventService).getEventsByParticipantId("userId", 0, 10, SortDirection.DESC, EventSortingField.DATE);
    }

    @Test
    public void testGetEventsCreatedByUserId() {
        Page<EventResponse> eventPage = new PageImpl<>(Arrays.asList(eventResponse));
        Mockito.when(eventService.getEventsCreatedByUserId(anyString(), any(int.class), any(int.class), any(SortDirection.class), any(EventSortingField.class)))
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
        Mockito.verify(eventService).leaveEvent("testId", "userId");
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
