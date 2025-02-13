package app.sportahub;

import app.sportahub.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ForgotPasswordRequestedEvent {
    private BaseEvent baseEvent;
    private String email;

    @JsonCreator
    public ForgotPasswordRequestedEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("email") String email)
    {
        this.baseEvent = baseEvent;
        this.email = email;
    }
    public String getEmail() {return this.email;}
    public BaseEvent getBaseEvent() {return this.baseEvent;}
}