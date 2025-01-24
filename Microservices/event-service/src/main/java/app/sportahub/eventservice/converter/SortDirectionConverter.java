package app.sportahub.eventservice.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;

import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.exception.event.InvalidSortingDirectionException;

public class SortDirectionConverter implements Converter<String, SortDirection>{

    @Override
    public SortDirection convert( String direction) {
        for(SortDirection sortDirection: SortDirection.values()) {
            if(sortDirection.name().equals(direction.toUpperCase())) {
                return SortDirection.valueOf(direction.toUpperCase());
            }
        }
        throw new InvalidSortingDirectionException(direction);
    }

}
