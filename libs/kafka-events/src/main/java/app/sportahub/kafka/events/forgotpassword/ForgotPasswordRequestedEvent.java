package app.sportahub.kafka.events.forgotpassword;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ForgotPasswordRequestedEvent {
    private final BaseEvent baseEvent;
    private final String email;

    @JsonCreator
    public ForgotPasswordRequestedEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("email") String email) {
        this.baseEvent = baseEvent;
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }

    public BaseEvent getBaseEvent() {
        return this.baseEvent;
    }
}
