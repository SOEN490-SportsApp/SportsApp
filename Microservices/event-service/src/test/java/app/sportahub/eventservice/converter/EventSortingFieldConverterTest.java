package app.sportahub.eventservice.converter;

import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.exception.event.InvalidEventSortingFieldException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class EventSortingFieldConverterTest {

    private EventSortingFieldConverter converter;

    @BeforeEach
    void setUp() {
        converter = new EventSortingFieldConverter();
    }

    @Test
        void shouldConvertToEventNameField() {
        EventSortingField result = converter.convert("event_name");
        assertEquals(EventSortingField.EVENT_NAME, result);
    }

    @Test
        void shouldConvertToSportTypeField() {
        EventSortingField result = converter.convert("sport_type");
        assertEquals(EventSortingField.SPORT_TYPE, result);
    }

    @Test
        void shouldConvertToDateField() {
        EventSortingField result = converter.convert("date");
        assertEquals(EventSortingField.DATE, result);
    }

    @Test
        void shouldThrowExceptionOnInvalidField() {
        String invalidField = "invalidField";
        String expectedMessage = "400 BAD_REQUEST \"Sorting field: " + invalidField + " is invalid for the Event Model.\"";
        InvalidEventSortingFieldException exception = assertThrows(
                InvalidEventSortingFieldException.class,
                () -> converter.convert(invalidField)
        );
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
        void shouldConvertFieldCaseInsensitive() {
        EventSortingField result = converter.convert("StArt_tIme");
        assertEquals(EventSortingField.START_TIME, result);
    }

    @Test
        void shouldConvertToMaxParticipantsField() {
        EventSortingField result = converter.convert("max_participants");
        assertEquals(EventSortingField.MAX_PARTICIPANTS, result);
    }

    @Test
        void shouldConvertToCreatedByField() {
        EventSortingField result = converter.convert("created_by");
        assertEquals(EventSortingField.CREATED_BY, result);
    }
}
