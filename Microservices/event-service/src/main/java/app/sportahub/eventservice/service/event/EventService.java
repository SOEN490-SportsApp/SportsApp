package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;

import java.util.List;

public interface EventService {

    EventResponse getEventById(String id);

    List<EventResponse> getAllEvents();

    EventResponse createEvent(EventRequest eventRequest);

    EventResponse updateEvent(String id, EventRequest eventRequest);

    EventResponse patchEvent(String id, EventRequest eventRequest);

    boolean isCreator(String id, String userId);

    void deleteEvent(String id);

    ParticipantResponse joinEvent(String id, String userId);
}
