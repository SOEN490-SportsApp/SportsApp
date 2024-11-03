package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.DateToLocalDateTimeConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

public class DateToLocalDateTimeConverterTest {

    private final DateToLocalDateTimeConverter converter = new DateToLocalDateTimeConverter();

    @Test
    public void shouldConvertDateToLocalDateTime() {
        LocalDateTime expectedLocalDateTime = LocalDateTime.of(2020, 1, 2, 10, 30);
        Date date = Date.from(expectedLocalDateTime.toInstant(ZoneOffset.UTC));

        LocalDateTime actualLocalDateTime = converter.convert(date);

        Assertions.assertNotNull(actualLocalDateTime);
        Assertions.assertEquals(expectedLocalDateTime, actualLocalDateTime);
    }

    @Test
    public void shouldConvertDateWithSpecificInstantToLocalDateTime() {
        LocalDateTime expectedLocalDateTime = LocalDateTime.of(2023, 11, 2, 15, 45, 30);
        Date date = Date.from(expectedLocalDateTime.toInstant(ZoneOffset.UTC));

        LocalDateTime actualLocalDateTime = converter.convert(date);

        Assertions.assertNotNull(actualLocalDateTime);
        Assertions.assertEquals(expectedLocalDateTime, actualLocalDateTime);
    }
}