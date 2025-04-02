package app.sportahub.kafkevents.joinsporteventevent;

import app.sportahub.kafkevents.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class JoinedEventsByUserFetchedEvent {
    private final BaseEvent baseEvent;
    private final List<String> eventIds;

    @JsonCreator
    public JoinedEventsByUserFetchedEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("eventIds") List<String> eventIds)
    {
        this.baseEvent = baseEvent;
        this.eventIds = eventIds;
    }
    public BaseEvent getBaseEvent() {return this.baseEvent;}
    public List<String> getEventIds() {return this.eventIds;}
}
