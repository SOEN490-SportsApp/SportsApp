package app.sportahub.eventservice.service.event;

import java.util.List;

import org.springframework.data.domain.Page;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SortDirection;

public interface EventService {

    EventResponse getEventById(String id);

    List<EventResponse> getAllEvents();

    EventResponse createEvent(EventRequest eventRequest);

    EventResponse updateEvent(String id, EventRequest eventRequest);

    EventResponse patchEvent(String id, EventRequest eventRequest);

    boolean isCreator(String id, String userId);

    void deleteEvent(String id);

    ParticipantResponse joinEvent(String id, String userId);

    ParticipantResponse leaveEvent(String eventId, String userId);

    Page<EventResponse> getEventsByParticipantId(String userId, int page, int size, SortDirection sort, EventSortingField field);

    Page<EventResponse> getEventsCreatedByUserId(String userId, int page, int size, SortDirection sort, EventSortingField field);
}
