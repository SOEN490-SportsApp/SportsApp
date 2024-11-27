package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;

public interface EventService {

    EventResponse getEventById(String id);

    EventResponse createEvent(EventRequest eventRequest);

}
