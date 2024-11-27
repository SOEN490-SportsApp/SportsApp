package app.sportahub.eventservice.mapper.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.model.event.Event;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface EventMapper {

    Event eventRequestToEvent(EventRequest eventRequest);

    EventResponse eventToEventResponse(Event event);
}
