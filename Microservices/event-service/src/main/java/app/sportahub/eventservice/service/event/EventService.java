package app.sportahub.eventservice.service.event;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.model.event.reactor.ReactionType;

public interface EventService {

    EventResponse getEventById(String id);

    List<EventResponse> getAllEvents();

    ResponseEntity<?> getRelevantEvents(double longitude, double latitude, double radius, boolean radiusExpansion, boolean paginate, int page, int size);

    EventResponse createEvent(EventRequest eventRequest);

    EventResponse updateEvent(String id, EventRequest eventRequest);

    EventResponse patchEvent(String id, EventRequest eventRequest);

    void deleteEvent(String id);

    boolean isCreator(String id, String userId);

    boolean isParticipant(String eventId, String userId);

    ParticipantResponse joinEvent(String id, String userId);

    ParticipantResponse leaveEvent(String eventId, String userId);

    Page<EventResponse> getEventsByParticipantId(String userId, int page, int size, SortDirection sort, EventSortingField field);

    Page<EventResponse> getEventsCreatedByUserId(String userId, int page, int size, SortDirection sort, EventSortingField field);

    EventResponse cancelEvent(String id, EventCancellationRequest cancelRequest);

    ReactionResponse reactToEvent(String id, ReactionType reaction);
}
