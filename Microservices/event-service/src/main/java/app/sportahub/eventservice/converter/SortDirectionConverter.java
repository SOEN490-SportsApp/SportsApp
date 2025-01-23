package app.sportahub.eventservice.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;

import app.sportahub.eventservice.enums.SortDirection;

public class SortDirectionConverter implements Converter<String, SortDirection>{

    @Override
    public SortDirection convert( String direction) {
        return SortDirection.valueOf(direction.toUpperCase());
    }

}
