package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.LocalDateToDateConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class LocalDateToDateConverterTest {

    private final LocalDateToDateConverter converter = new LocalDateToDateConverter();

    @Test
    public void shouldConvertToDateConverter() {
        LocalDate localDate = LocalDate.of(2020, 1, 2);

        Date date = converter.convert(localDate);

        Assertions.assertNotNull(date);

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(ZoneOffset.UTC));
        calendar.setTime(date);

        Assertions.assertEquals(2020, calendar.get(Calendar.YEAR));
        Assertions.assertEquals(1, calendar.get(Calendar.MONTH) + 1);
        Assertions.assertEquals(2, calendar.get(Calendar.DAY_OF_MONTH));
        Assertions.assertEquals(localDate, date.toInstant().atZone(ZoneOffset.UTC).toLocalDate());
    }
}
