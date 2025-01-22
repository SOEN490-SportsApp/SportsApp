package app.sportahub.eventservice.controller;

import app.sportahub.eventservice.config.TestSecurityConfig;
import app.sportahub.eventservice.dto.request.LocationRequest;
import app.sportahub.eventservice.dto.request.ParticipantRequest;
import app.sportahub.eventservice.dto.request.TeamRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import app.sportahub.eventservice.service.event.EventServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import app.sportahub.eventservice.dto.request.EventRequest;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

@ActiveProfiles("event-service.test")
@WebMvcTest(EventController.class)
@Import({EventServiceImpl.class, TestSecurityConfig.class})
public class EventControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    private EventServiceImpl eventService;

    @Autowired
    private ObjectMapper objectMapper;

    private final EventMapper eventMapper = Mappers.getMapper(EventMapper.class);

    private EventRequest validEventRequest;

    @SneakyThrows
    @BeforeEach
    public void setUp() {
        LocationRequest validLocationRequest = new LocationRequest(
                "testLocationName",
                "testStreetNumber",
                "testStreetName",
                "testCity",
                "testProvince",
                "testCountry",
                "testPostalCode",
                "testAddressLine2",
                "testPhoneNumber",
                "testLatitude",
                "testLongitude");

        ParticipantRequest validParticipantRequest = new ParticipantRequest(
                "testParticipantUserId",
                ParticipantAttendStatus.JOINED,
                LocalDate.of(2025, 1, 1));

        List<ParticipantRequest> participantRequestList = new ArrayList<>();
        participantRequestList.add(validParticipantRequest);

        TeamRequest validTeamRequest = new TeamRequest("testTeamID");
        List<TeamRequest> teamRequestList = new ArrayList<>();
        teamRequestList.add(validTeamRequest);

        List<String> whiteListedUsers = new ArrayList<>();
        whiteListedUsers.add("testUserID");

        EnumSet<SkillLevelEnum> requiredSkillLevel = EnumSet.of(SkillLevelEnum.BEGINNER, SkillLevelEnum.INTERMEDIATE);

        validEventRequest = new EventRequest(
                "testEventName",
                "testEventType",
                "testSportType",
                validLocationRequest,
                LocalDate.of(2025,1,1),
                LocalTime.of(12,30),
                LocalTime.of(18,30),
                "testEventDuration",
                2,
                participantRequestList,
                "testEventCreatedBy",
                teamRequestList,
                "testEventCutOffTime",
                "testEventDescription",
                true,
                whiteListedUsers,
                requiredSkillLevel);
    }

    @SneakyThrows
    @Test
    public void shouldReturnEventByIdSuccessfully() {
        //Arrange
        Event event = eventMapper.eventRequestToEvent(validEventRequest);
        event.setId("testEventID");
        when(eventService.getEventById(event.getId())).thenReturn(eventMapper.eventToEventResponse(event));

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/event/{id}",event.getId()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(event.getId()));
    }

    @SneakyThrows
    @Test
    public void shouldRetrieveAllEventsSuccessfully() {
        //Arrange
        Event event1 = eventMapper.eventRequestToEvent(validEventRequest);
        event1.setId("testEventID1");

        Event event2 = eventMapper.eventRequestToEvent(validEventRequest);
        event2.setId("testEventID2");

        List<EventResponse> eventResponseList = new ArrayList<>();
        eventResponseList.add(eventMapper.eventToEventResponse(event1));
        eventResponseList.add(eventMapper.eventToEventResponse(event2));

        when(eventService.getAllEvents()).thenReturn(eventResponseList);

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/event"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(event1.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(event2.getId()));
    }

    @SneakyThrows
    @Test
    public void shouldCreateEventSuccessfully() {
        //Arrange
        Event event = eventMapper.eventRequestToEvent(validEventRequest);
        event.setId("testEventID");

        when(eventService.createEvent(validEventRequest)).thenReturn(eventMapper.eventToEventResponse(event));

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.post("/event")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                        .andExpect(status().is(201))
                        .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(event.getId()));
    }

    @SneakyThrows
    @Test
    public void shouldUpdateEventSuccessfully() {
        //Arrange
        Event event = eventMapper.eventRequestToEvent(validEventRequest);
        event.setId("testEventID");

        when(eventService.updateEvent(event.getId(),validEventRequest)).thenReturn(eventMapper.eventToEventResponse(event));

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.put("/event/{id}",event.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("testEventID"));
    }

    @SneakyThrows
    @Test
    public void shouldPatchEventSuccessfully() {
        //Arrange
        Event event = eventMapper.eventRequestToEvent(validEventRequest);
        event.setId("testEventID");

        when(eventService.patchEvent(event.getId(),validEventRequest)).thenReturn(eventMapper.eventToEventResponse(event));

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.patch("/event/{id}",event.getId())
        .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("testEventID"));
    }

    @SneakyThrows
    @Test
    public void shouldDeleteEventSuccessfully() {
        //Arrange
        doNothing().when(eventService).deleteEvent("testEventID");

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.delete("/event/{id}", "testEventID"))
                .andExpect(status().isNoContent())
                .andExpect(MockMvcResultMatchers.jsonPath("$").doesNotExist());
    }

    @SneakyThrows
    @Test
    public void shouldJoinEventSuccessfully() {
        //Arrange
        ParticipantResponse participantResponse = new ParticipantResponse(
                "testUserID",
                ParticipantAttendStatus.JOINED,
                LocalDate.of(2025,1,1));

        when(eventService.joinEvent("testEventID", "testUserID")).thenReturn(participantResponse);

        //Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.post("/event/{id}/join", "testEventID")
                        .param("userId", "testUserID"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value("testUserID"));
    }
}
