package app.sportahub.kafka.events.user;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.lang.String;


public class UserFetchEvent {
    private final BaseEvent baseEvent;
    private final String userId;

    @JsonCreator
    public UserFetchEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId)
    {
        this.baseEvent = baseEvent;
        this.userId = userId;
    }
    public String getUserId() {return this.userId;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}
