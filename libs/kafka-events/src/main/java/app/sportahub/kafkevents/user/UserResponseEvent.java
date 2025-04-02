package app.sportahub.kafkevents.user;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import app.sportahub.kafkevents.BaseEvent;


public class UserResponseEvent {
    private final BaseEvent baseEvent;
    private final String user;

    @JsonCreator
    public UserResponseEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("user") String user)
    {
        this.baseEvent = baseEvent;
        this.user = user;
    }
    public String getUser() {return this.user;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}
