package app.sportahub.kafka.events.joinsporteventevent;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
public class JoinedEventsByUserFetchedEvent extends BaseEvent {
    private final BaseEvent baseEvent;
    private final List<String> eventIds;

    @JsonCreator
    public JoinedEventsByUserFetchedEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("eventIds") List<String> eventIds) {
        super(baseEvent);
        this.baseEvent = baseEvent;
        this.eventIds = eventIds;
    }
}
