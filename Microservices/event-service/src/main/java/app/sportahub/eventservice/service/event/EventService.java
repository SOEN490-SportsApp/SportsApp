package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.model.event.Event;

public interface EventService {

    Event getEventById(String id);

    Event createEvent(EventRequest eventRequest);

}
