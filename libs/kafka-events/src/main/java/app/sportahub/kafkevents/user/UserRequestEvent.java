package app.sportahub.kafkevents.user;

import app.sportahub.kafkevents.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.lang.String;

public class UserRequestEvent {
    private final BaseEvent baseEvent;
    private final String userId;

    @JsonCreator
    public UserRequestEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId)
    {
        this.baseEvent = baseEvent;
        this.userId = userId;
    }
    public String getUserId() {return this.userId;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}
