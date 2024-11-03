package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.TimestampToDateConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.util.Date;

public class TimestampToDateConverterTest {

    private final TimestampToDateConverter converter = new TimestampToDateConverter();

    @Test
    public void shouldConvertTimestampToDate() {
        // Given a specific Timestamp
        Timestamp timestamp = Timestamp.valueOf("2020-01-02 10:30:00");

        // When converting the Timestamp to Date
        Date date = converter.convert(timestamp);

        // Then the Date should have the same instant as the Timestamp
        Assertions.assertNotNull(date);
        Assertions.assertEquals(timestamp.getTime(), date.getTime());
    }

    @Test
    public void shouldConvertTimestampWithSpecificInstantToDate() {
        Timestamp timestamp = Timestamp.valueOf("2023-11-02 15:45:30");

        Date date = converter.convert(timestamp);

        Assertions.assertNotNull(date);
        Assertions.assertEquals(timestamp.getTime(), date.getTime());
    }
}