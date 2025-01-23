package app.sportahub.eventservice.converter;

import org.springframework.core.convert.converter.Converter;

import app.sportahub.eventservice.enums.EventSortingField;

public class EventSortingFieldConverter implements Converter<String, EventSortingField>{

    @Override
    public EventSortingField convert(String field) {
        return EventSortingField.valueOf(field.toUpperCase());  
    }

}
