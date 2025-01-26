package app.sportahub.eventservice.converter;

import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.exception.event.InvalidSortingDirectionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class SortDirectionConverterTest {

    private SortDirectionConverter converter;

    @BeforeEach
    void setUp() {
        converter = new SortDirectionConverter();
    }

    @Test
    void shouldConvertToAscendingDirection() {
        SortDirection result = converter.convert("asc");
        assertEquals(SortDirection.ASC, result);
    }

    @Test
    void shouldConvertToDescendingDirection() {
        SortDirection result = converter.convert("desc");
        assertEquals(SortDirection.DESC, result);
    }

    @Test
    void shouldThrowExceptionOnInvalidDirection() {
        String invalidDirection = "upwards";
        String expectedMessage = "400 BAD_REQUEST \"Sorting direction: " + invalidDirection + " is invalid.\"";
        InvalidSortingDirectionException exception = assertThrows(
                InvalidSortingDirectionException.class,
                () -> converter.convert(invalidDirection)
        );
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void shouldConvertDirectionCaseInsensitive() {
        SortDirection result = converter.convert("DeSc");
        assertEquals(SortDirection.DESC, result);
    }
}
