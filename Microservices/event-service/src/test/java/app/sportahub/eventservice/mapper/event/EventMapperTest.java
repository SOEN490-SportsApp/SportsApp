package app.sportahub.eventservice.mapper.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.request.LocationRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.Team;
import app.sportahub.eventservice.model.event.participant.Participant;
import app.sportahub.eventservice.model.event.participant.ParticipantAttendStatus;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EventMapperTest {

    private final EventMapper eventMapper = Mappers.getMapper(EventMapper.class);

    @Test
    public void testEventRequestToEvent() {
        //Arrange
        EventRequest nullEventRequest = null;

        //Act
        Event nullEvent = eventMapper.eventRequestToEvent(nullEventRequest);

        //Assert
        assertNull(nullEvent);
    }

    @Test
    public void testEventToEventResponse() {
        //Arrange
        Event nullEvent = null;

        Event nullEvent2 = new Event(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

        //Act
        EventResponse nullEventResponse = eventMapper.eventToEventResponse(nullEvent);

        EventResponse nullEventResponse2 = eventMapper.eventToEventResponse(nullEvent2);

        //Assert
        assertNull(nullEventResponse);

        assertNull(nullEventResponse2.participants());
        assertNull(nullEventResponse2.teams());
        assertNull(nullEventResponse2.whitelistedUsers());
    }

    @Test
    public void testPatchEventFromRequest() {
        //Arrange
        Location location = Location.builder()
                .withName("locationName")
                .withStreetNumber("streetNumber")
                .withStreetName("streetName")
                .withCity("city")
                .withProvince("province")
                .withCountry("country")
                .withPostalCode("postalCode")
                .withAddressLine2("addressLine2")
                .withPhoneNumber("phoneNumber")
                .withLatitude("latitude")
                .withLongitude("longitude")
                .build();

        Participant participant = Participant.builder()
                .withUserId("participantID")
                .withAttendStatus(ParticipantAttendStatus.JOINED)
                .withJoinedOn(LocalDate.now())
                .build();

        List<Participant> participants = List.of(participant);

        Team team = Team.builder().withTeamId("teamID").build();
        List<Team> teams = List.of(team);

        List<String> whitelistedUsers = List.of("userID");

        EnumSet<SkillLevelEnum> requiredSkillLevels = EnumSet.allOf(SkillLevelEnum.class);

        Event event = Event.builder()
                .withId("eventID")
                .withEventName("eventName")
                .withEventType("eventType")
                .withSportType("sportType")
                .withLocation(location)
                .withDate(LocalDate.now())
                .withStartTime(LocalTime.now())
                .withEndTime(LocalTime.now())
                .withDuration("duration")
                .withMaxParticipants(1)
                .withParticipants(participants)
                .withCreatedBy("createdBy")
                .withTeams(teams)
                .withCutOffTime("cutOfftime")
                .withDescription("description")
                .withIsPrivate(true)
                .withWhitelistedUsers(whitelistedUsers)
                .withRequiredSkillLevel(requiredSkillLevels)
                .build();

        EventRequest nullEventRequest = null;
        EventRequest eventRequest = new EventRequest(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

        //Act & Assert
        //Test if evenRequest == null
        eventMapper.patchEventFromRequest(nullEventRequest, event);
        assertNotNull(event.getLocation());

        //Test if eventRequest.location() == null & event.getLocation() != null
        eventMapper.patchEventFromRequest(eventRequest, event);
        assertNotNull(event.getLocation());

        eventMapper.patchEventFromRequest(nullEventRequest, event);
    }

    @Test
    public void testLocationRequestToLocation1() {
        // Arrange
        Event event = new Event();
        event.setLocation(new Location(
                "name",
                "streetNumber",
                "streetName",
                "city",
                "province",
                "country",
                "postalCode",
                "addressLine2",
                "phoneNumber",
                "latitude",
                "longitude"));

        LocationRequest locationRequest = new LocationRequest(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

        EventRequest eventRequest = new EventRequest(
                null,
                null,
                null,
                locationRequest,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

        //Act
        eventMapper.eventRequestToEvent(eventRequest);
        eventMapper.patchEventFromRequest(eventRequest, event);

        //Assert
        assertNotNull(event.getLocation());
        assertNotNull(event.getLocation().getName());
        assertNotNull(event.getLocation().getStreetNumber());
        assertNotNull(event.getLocation().getStreetName());
        assertNotNull(event.getLocation().getCity());
        assertNotNull(event.getLocation().getProvince());
        assertNotNull(event.getLocation().getCountry());
        assertNotNull(event.getLocation().getPostalCode());
        assertNotNull(event.getLocation().getAddressLine2());
        assertNotNull(event.getLocation().getPhoneNumber());
        assertNotNull(event.getLocation().getLatitude());
        assertNotNull(event.getLocation().getLongitude());
    }
}
