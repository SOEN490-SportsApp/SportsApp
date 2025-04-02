package app.sportahub.kafkevents.joinsporteventevent;

import app.sportahub.kafkevents.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JoinedEventsByUserRequestEvent {
    private final BaseEvent baseEvent;
    private final String userId;

    @JsonCreator
    public JoinedEventsByUserRequestEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId)
    {
        this.baseEvent = baseEvent;
        this.userId = userId;
    }
    public String getUserId() {return this.userId;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}
