package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.LocationResponse;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.exception.event.NoSearchCriteriaProvidedException;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.repository.SearchingEventRepositoryImpl;
import app.sportahub.eventservice.repository.event.EventRepository;
import org.junit.jupiter.api.Assertions;
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
import org.springframework.data.mongodb.core.MongoTemplate;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class EventSearchTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMapper eventMapper;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private EventServiceImpl eventService;

    @Mock
    private SearchingEventRepositoryImpl searchingEventRepository;

    @BeforeEach
    void setUp() {
        eventService = new EventServiceImpl(eventRepository, eventMapper);
        searchingEventRepository = new SearchingEventRepositoryImpl(mongoTemplate);
    }

    @Test
    void testSearchEvents_WithAllCriteria() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Location location = Location.builder()
                .withName("Central Park")
                .withCity("New York")
                .withProvince("NY")
                .withCountry("USA")
                .withPostalCode("10001")
                .build();

        Event event = Event.builder()
                .withId("event123")
                .withCreationDate(Timestamp.valueOf("2023-10-01 12:00:00"))
                .withEventName("Soccer Match")
                .withEventType("Friendly")
                .withSportType("Soccer")
                .withLocation(location)
                .withDate(LocalDate.of(2023, 10, 15))
                .withStartTime(LocalTime.of(14, 0))
                .withEndTime(LocalTime.of(16, 0))
                .withDuration("120")
                .withMaxParticipants(20)
                .withCreatedBy("user123")
                .withIsPrivate(false)
                .withRequiredSkillLevel(EnumSet.of(SkillLevelEnum.INTERMEDIATE))
                .build();

        List<Event> events = Collections.singletonList(event);
        Page<Event> mockEventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.searchEvents("Soccer Match", "Friendly", "Soccer", "Central Park", "New York", "NY", "USA", "10001", "2023-10-15", "14:00", "16:00", "120", "20", "user123", false, List.of(SkillLevelEnum.INTERMEDIATE), pageable))
                .thenReturn(mockEventPage);

        LocationResponse locationResponse = new LocationResponse("Central Park", "", "", "New York", "NY", "USA", "10001", "", "", null);

        EventResponse eventResponse = new EventResponse(
                "event123",
                Timestamp.valueOf("2023-10-01 12:00:00"),
                "Soccer Match",
                "Friendly",
                "Soccer",
                locationResponse,
                LocalDate.of(2023, 10, 15),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                "120",
                20,
                Collections.emptyList(),
                Collections.emptyList(),
                "user123",
                Collections.emptyList(),
                "18:00",
                "A friendly soccer match in Central Park",
                false,
                Collections.emptyList(),
                EnumSet.of(SkillLevelEnum.INTERMEDIATE),
                Collections.emptyList(),
                null
        );

        when(eventMapper.eventToEventResponse(event)).thenReturn(eventResponse);

        // Act
        Page<EventResponse> result = eventService.searchEvents("Soccer Match", "Friendly", "Soccer", "Central Park", "New York", "NY", "USA", "10001", "2023-10-15", "14:00", "16:00", "120", "20", "user123", false, List.of(SkillLevelEnum.INTERMEDIATE), pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("event123", result.getContent().getFirst().id());
        assertEquals(Timestamp.valueOf("2023-10-01 12:00:00"), result.getContent().getFirst().creationDate());
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
        Assertions.assertEquals(EnumSet.of(SkillLevelEnum.INTERMEDIATE), result.getContent().getFirst().requiredSkillLevel());

        // Verify interactions
        verify(eventRepository, times(1)).searchEvents("Soccer Match", "Friendly", "Soccer", "Central Park", "New York", "NY", "USA", "10001", "2023-10-15", "14:00", "16:00", "120", "20", "user123", false, List.of(SkillLevelEnum.INTERMEDIATE), pageable);
        verify(eventMapper, times(1)).eventToEventResponse(event);
    }

    @Test
    void testSearchEvents_WithNoCriteria() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act & Assert
        Assertions.assertThrows(NoSearchCriteriaProvidedException.class, () -> {
            eventService.searchEvents(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, pageable);
        });

        // Verify interactions
        verify(eventRepository, never()).searchEvents(any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any());
        verify(eventMapper, never()).eventToEventResponse(any());
    }

    @Test
    void testSearchEvents_WithPartialCriteria() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Location location = Location.builder()
                .withName("Central Park")
                .withCity("New York")
                .withProvince("NY")
                .withCountry("USA")
                .withPostalCode("10001")
                .build();

        Event event = Event.builder()
                .withEventName("Soccer Match")
                .withSportType("Soccer")
                .withLocation(location)
                .withDate(LocalDate.of(2023, 10, 15))
                .build();

        List<Event> events = Collections.singletonList(event);
        Page<Event> mockEventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.searchEvents("Soccer Match", null, "Soccer", null, "New York", null, null, null, "2023-10-15", null, null, null, null, null, null, null, pageable))
                .thenReturn(mockEventPage);

        LocationResponse locationResponse = new LocationResponse("Central Park", "", "", "New York", "NY", "USA", "10001", "", "", null);

        EventResponse eventResponse = new EventResponse(
                "event123",
                Timestamp.valueOf("2023-10-01 12:00:00"),
                "Soccer Match",
                "Friendly",
                "Soccer",
                locationResponse,
                LocalDate.of(2023, 10, 15),
                LocalTime.of(14, 0),
                LocalTime.of(16, 0),
                "120",
                20,
                Collections.emptyList(), // participants
                Collections.emptyList(),
                "user123",
                Collections.emptyList(), // teams
                "18:00", // cutOffTime
                "A friendly soccer match in Central Park",
                false,
                Collections.emptyList(), // whitelistedUsers
                EnumSet.of(SkillLevelEnum.INTERMEDIATE),
                Collections.emptyList(),
                null
        );


        when(eventMapper.eventToEventResponse(event)).thenReturn(eventResponse);

        // Act
        Page<EventResponse> result = eventService.searchEvents("Soccer Match", null, "Soccer", null, "New York", null, null, null, "2023-10-15", null, null, null, null, null, null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Soccer Match", result.getContent().getFirst().eventName());
        assertEquals("Soccer", result.getContent().getFirst().sportType());
        assertEquals("New York", result.getContent().getFirst().locationResponse().city());
        assertEquals(LocalDate.of(2023, 10, 15), result.getContent().getFirst().date());

        // Verify interactions
        verify(eventRepository, times(1)).searchEvents("Soccer Match", null, "Soccer", null, "New York", null, null, null, "2023-10-15", null, null, null, null, null, null, null, pageable);
        verify(eventMapper, times(1)).eventToEventResponse(event);
    }

    @Test
    void testSearchEvents_WithDateRange() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Event event = Event.builder()
                .withId("event123")
                .withEventName("Soccer Match")
                .withDate(LocalDate.of(2023, 10, 15))
                .build();

        List<Event> events = Collections.singletonList(event);
        Page<Event> mockEventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.searchEvents(
                null, null, null, null, null, null, null, null,
                "2023-10-15-2023-10-20", null, null, null, null, null, null, null, pageable
        )).thenReturn(mockEventPage);

        EventResponse eventResponse = new EventResponse(
                "event123",
                null,
                "Soccer Match",
                null,
                null,
                null,
                LocalDate.of(2023, 10, 15),
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
                null
        );

        when(eventMapper.eventToEventResponse(event)).thenReturn(eventResponse);

        // Act
        Page<EventResponse> result = eventService.searchEvents(
                null, null, null, null, null, null, null, null,
                "2023-10-15-2023-10-20", null, null, null, null, null, null, null, pageable
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("event123", result.getContent().getFirst().id());
        assertEquals("Soccer Match", result.getContent().getFirst().eventName());
        assertEquals(LocalDate.of(2023, 10, 15), result.getContent().getFirst().date());

        // Verify interactions
        verify(eventRepository, times(1)).searchEvents(
                null, null, null, null, null, null, null, null,
                "2023-10-15-2023-10-20", null, null, null, null, null, null, null, pageable
        );
        verify(eventMapper, times(1)).eventToEventResponse(event);
    }

    @Test
    void testSearchEvents_WithStartTimeRange() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Event event = Event.builder()
                .withId("event123")
                .withEventName("Soccer Match")
                .withStartTime(LocalTime.of(14, 0))
                .build();

        List<Event> events = Collections.singletonList(event);
        Page<Event> mockEventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.searchEvents(
                null, null, null, null, null, null, null, null, null,
                "14:00-16:00", null, null, null, null, null, null, pageable
        )).thenReturn(mockEventPage);

        EventResponse eventResponse = new EventResponse(
                "event123",
                null,
                "Soccer Match",
                null,
                null,
                null,
                null,
                LocalTime.of(14, 0),
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
                null
        );

        when(eventMapper.eventToEventResponse(event)).thenReturn(eventResponse);

        // Act
        Page<EventResponse> result = eventService.searchEvents(
                null, null, null, null, null, null, null, null, null,
                "14:00-16:00", null, null, null, null, null, null, pageable
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("event123", result.getContent().getFirst().id());
        assertEquals("Soccer Match", result.getContent().getFirst().eventName());
        assertEquals(LocalTime.of(14, 0), result.getContent().getFirst().startTime());

        // Verify interactions
        verify(eventRepository, times(1)).searchEvents(
                null, null, null, null, null, null, null, null, null,
                "14:00-16:00", null, null, null, null, null, null, pageable
        );
        verify(eventMapper, times(1)).eventToEventResponse(event);
    }

    @Test
    void testSearchEvents_WithMaxParticipantsRange() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Event event = Event.builder()
                .withId("event123")
                .withEventName("Soccer Match")
                .withMaxParticipants(15)
                .build();

        List<Event> events = Collections.singletonList(event);
        Page<Event> mockEventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.searchEvents(
                null, null, null, null, null, null, null, null, null, null, null,
                "10-20", null, null, null, null, pageable
        )).thenReturn(mockEventPage);

        EventResponse eventResponse = new EventResponse(
                "event123",
                null,
                "Soccer Match",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                15,
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
                null
        );

        when(eventMapper.eventToEventResponse(event)).thenReturn(eventResponse);

        // Act
        Page<EventResponse> result = eventService.searchEvents(
                null, null, null, null, null, null, null, null, null, null, null,
                "10-20", null, null, null, null, pageable
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("event123", result.getContent().getFirst().id());
        assertEquals("Soccer Match", result.getContent().getFirst().eventName());
        assertEquals(15, result.getContent().getFirst().maxParticipants());

        // Verify interactions
        verify(eventRepository, times(1)).searchEvents(
                null, null, null, null, null, null, null, null, null, null, null,
                "10-20", null, null, null, null, pageable
        );
        verify(eventMapper, times(1)).eventToEventResponse(event);
    }
}