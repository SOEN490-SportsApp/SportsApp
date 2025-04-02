package app.sportahub.kafka.events.joinsporteventevent;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class JoinedEventsByUserResponseEvent {
    private final BaseEvent baseEvent;
    private final List<String> eventIds;

    @JsonCreator
    public JoinedEventsByUserResponseEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("eventIds") List<String> eventIds) {
        this.baseEvent = baseEvent;
        this.eventIds = eventIds;
    }

    public BaseEvent getBaseEvent() {
        return this.baseEvent;
    }

    public List<String> getEventIds() {
        return this.eventIds;
    }
}
