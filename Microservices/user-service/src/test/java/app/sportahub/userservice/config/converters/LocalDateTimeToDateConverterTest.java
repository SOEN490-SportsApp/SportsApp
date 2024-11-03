package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.LocalDateTimeToDateConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

public class LocalDateTimeToDateConverterTest {

    private final LocalDateTimeToDateConverter converter = new LocalDateTimeToDateConverter();

    @Test
    public void shouldConvertLocalDateTimeToDate() {
        LocalDateTime localDateTime = LocalDateTime.of(2020, 1, 2, 10, 30);

        Date date = converter.convert(localDateTime);

        Assertions.assertNotNull(date);
        Assertions.assertEquals(localDateTime.toInstant(ZoneOffset.UTC), date.toInstant());
    }

    @Test
    public void shouldConvertLocalDateTimeWithSpecificTimeToDate() {
        LocalDateTime localDateTime = LocalDateTime.of(2023, 11, 2, 15, 45, 30);

        Date date = converter.convert(localDateTime);

        Assertions.assertNotNull(date);
        Assertions.assertEquals(localDateTime.toInstant(ZoneOffset.UTC), date.toInstant());
    }
}
