package app.sportahub.kafkevents.JoinedSportEventEvent;

import app.sportahub.kafkevents.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JoinedEventsByUserFetchEvent {
    private final BaseEvent baseEvent;
    private final String userId;

    @JsonCreator
    public JoinedEventsByUserFetchEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId)
    {
        this.baseEvent = baseEvent;
        this.userId = userId;
    }
    public String getEmail() {return this.userId;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}
