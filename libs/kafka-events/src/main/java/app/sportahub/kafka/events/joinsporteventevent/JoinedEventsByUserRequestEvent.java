package app.sportahub.kafka.events.joinsporteventevent;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class JoinedEventsByUserRequestEvent extends BaseEvent {
    private final BaseEvent baseEvent;
    private final String userId;

    @JsonCreator
    public JoinedEventsByUserRequestEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId) {
        super(baseEvent);
        this.baseEvent = baseEvent;
        this.userId = userId;
    }
}
