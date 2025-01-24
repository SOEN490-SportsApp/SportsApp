package app.sportahub.eventservice.converter;

import org.springframework.core.convert.converter.Converter;

import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.exception.event.InvalidEventSortingFieldException;

public class EventSortingFieldConverter implements Converter<String, EventSortingField>{

    @Override
    public EventSortingField convert(String field) {
        for(EventSortingField eventSortingField: EventSortingField.values()) {
            if(eventSortingField.name().equals(field.toUpperCase())) {
                return EventSortingField.valueOf(field.toUpperCase());  
            }
        }
        throw new InvalidEventSortingFieldException(field);
    }

}
