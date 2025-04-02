package app.sportahub.kafka.events.forgotpassword;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class ForgotPasswordSendEmailEvent extends BaseEvent {
    private final BaseEvent baseEvent;
    private final String email;

    @JsonCreator
    public ForgotPasswordSendEmailEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("email") String email) {
        super(baseEvent);
        this.baseEvent = baseEvent;
        this.email = email;
    }

}
