package app.sportahub.eventservice.mapper.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.model.event.Event;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface EventMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Event eventRequestToEvent(EventRequest eventRequest);

    @Mapping(target = "locationResponse", source = "location")
    EventResponse eventToEventResponse(Event event);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEventFromRequest(EventRequest eventRequest, @MappingTarget Event event);
}
