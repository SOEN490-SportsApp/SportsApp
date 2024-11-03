package app.sportahub.userservice.config.converters;

import app.sportahub.userservice.config.MongoConfig.DateToLocalDateConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class DateToLocalDateConverterTest {

    private final DateToLocalDateConverter converter = new DateToLocalDateConverter();

    @Test
    public void shouldConvertDateToLocalDate() {
        LocalDate expectedLocalDate = LocalDate.of(2020, 1, 2);
        Date date = Date.from(expectedLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        LocalDate actualLocalDate = converter.convert(date);

        Assertions.assertEquals(expectedLocalDate, actualLocalDate);
    }

    @Test
    public void shouldConvertDateWithDifferentTimeOfDay() {
        LocalDate expectedLocalDate = LocalDate.of(2023, 11, 2);
        Date date = Date.from(expectedLocalDate.atTime(15, 30).atZone(ZoneId.systemDefault()).toInstant());

        LocalDate localDate = converter.convert(date);

        Assertions.assertEquals(expectedLocalDate, localDate);
    }
}
