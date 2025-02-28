package app.sportahub.eventservice.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.RequiredArgsConstructor;
import org.bson.UuidRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@RequiredArgsConstructor
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    public String mongoUri;

    @Override
    public MongoClient mongoClient() {
        var connectionString = new ConnectionString(mongoUri);
        var settings = MongoClientSettings.builder()
                .retryWrites(true)
                .applyConnectionString(connectionString)
                .applyToConnectionPoolSettings(builder -> builder
                        .minSize(5)
                        .maxSize(100)
                        .maxConnectionLifeTime(30, TimeUnit.MINUTES)
                        .maxConnectionIdleTime(10, TimeUnit.MINUTES)
                )
                .applyToSocketSettings(builder -> builder
                        .connectTimeout(10, TimeUnit.SECONDS)
                        .readTimeout(10, TimeUnit.SECONDS)
                )
                .applicationName("event-service")
                .uuidRepresentation(UuidRepresentation.STANDARD)
                .build();
        return MongoClients.create(settings);
    }

    @Override
    protected String getDatabaseName() {
        return "event-service";
    }

    @Override
    public boolean autoIndexCreation() {
      return true;
    }

    @Bean
    @Override
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(List.of(
                new LocalDateToDateConverter(),
                new DateToLocalDateConverter(),
                new LocalDateTimeToDateConverter(),
                new DateToLocalDateTimeConverter(),
                new TimestampToDateConverter(),
                new DateToTimestampConverter()
        ));
    }

    public static class LocalDateToDateConverter implements Converter<LocalDate, Date> {
        @Override
        public Date convert(LocalDate source) {
            return Date.from(source.atStartOfDay(ZoneOffset.UTC).toInstant());
        }
    }

    public static class DateToLocalDateConverter implements Converter<Date, LocalDate> {
        @Override
        public LocalDate convert(Date source) {
            return source.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        }
    }

    public static class LocalDateTimeToDateConverter implements Converter<LocalDateTime, Date> {
        @Override
        public Date convert(LocalDateTime source) {
            return Date.from(source.toInstant(ZoneOffset.UTC));
        }
    }

    public static class DateToLocalDateTimeConverter implements Converter<Date, LocalDateTime> {
        @Override
        public LocalDateTime convert(Date source) {
            return LocalDateTime.ofInstant(source.toInstant(), ZoneOffset.UTC);
        }
    }

    public static class TimestampToDateConverter implements Converter<Timestamp, Date> {
        @Override
        public Date convert(Timestamp source) {
            return new Date(source.getTime());
        }
    }

    public static class DateToTimestampConverter implements Converter<Date, Timestamp> {
        @Override
        public Timestamp convert(Date source) {
            return new Timestamp(source.getTime());
        }
    }
}