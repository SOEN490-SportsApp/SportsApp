package app.sportahub.kafkevents;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.Instant;

public class BaseEvent implements Serializable {
    private String eventId;
    private String eventType;
    private String source;
    private Instant timestamp;
    private String correlationId;

    @JsonCreator
    public BaseEvent(
            @JsonProperty("eventId") String eventId,
            @JsonProperty("eventType") String eventType,
            @JsonProperty("source") String source,
            @JsonProperty("timestamp") Instant timestamp,
            @JsonProperty("correlationId") String correlationId)
    {
        this.eventId = eventId;
        this.eventType = eventType;
        this.source = source;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
    public String getEventId() {return eventId;}
    public String getEventType() {return eventType;}
    public String getSource() {return source;}
    public Instant getTimestamp() {return timestamp;}
    public String getCorrelationId() {return correlationId;}
}