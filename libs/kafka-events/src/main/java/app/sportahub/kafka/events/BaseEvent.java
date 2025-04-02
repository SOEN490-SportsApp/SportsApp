package app.sportahub.kafka.events;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.io.Serializable;
import java.time.Instant;

@Getter
public class BaseEvent implements Serializable {
    private final String eventId;
    private final String eventType;
    private final String source;
    private final Instant timestamp;
    private final String correlationId;

    @JsonCreator
    public BaseEvent(
            @JsonProperty("eventId") String eventId,
            @JsonProperty("eventType") String eventType,
            @JsonProperty("source") String source,
            @JsonProperty("timestamp") Instant timestamp,
            @JsonProperty("correlationId") String correlationId) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.source = source;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }

    public BaseEvent(BaseEvent baseEvent) {
        this.eventId = baseEvent.eventId;
        this.eventType = baseEvent.eventType;
        this.source = baseEvent.source;
        this.timestamp = baseEvent.timestamp;
        this.correlationId = baseEvent.correlationId;
    }
}
