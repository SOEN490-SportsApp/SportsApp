package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.DateToTimestampConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.util.Date;

public class DateToTimestampConverterTest {

    private final DateToTimestampConverter converter = new DateToTimestampConverter();

    @Test
    public void shouldConvertDateToTimestamp() {
        Date date = new Date(1609451400000L); // January 1, 2021 10:30:00 UTC

        Timestamp timestamp = converter.convert(date);

        Assertions.assertNotNull(timestamp);
        Assertions.assertEquals(date.getTime(), timestamp.getTime());
    }

    @Test
    public void shouldConvertDateWithSpecificInstantToTimestamp() {
        Date date = new Date(1688473530000L); // July 4, 2023 15:45:30 UTC

        Timestamp timestamp = converter.convert(date);

        Assertions.assertNotNull(timestamp);
        Assertions.assertEquals(date.getTime(), timestamp.getTime());
    }
}