package app.sportahub.kafka.events.notification;

import app.sportahub.kafka.events.BaseEvent;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Map;

@Getter
public class NotificationEvent extends BaseEvent {
    private final BaseEvent baseEvent;
    private final String userId;
    private final String messageTitle;
    private final String messageBody;
    private final Map<String, String> data;
    private final String clickAction;
    private final String icon;
    private final String messageSubtitle;
    private final Integer badgeCount;
    private final Boolean playSound;

    @JsonCreator
    public NotificationEvent(
            @JsonProperty("baseEvent") BaseEvent baseEvent,
            @JsonProperty("userId") String userId,
            @JsonProperty("messageTitle") String messageTitle,
            @JsonProperty("messageBody") String messageBody,
            @JsonProperty("data") Map<String, String> data,
            @JsonProperty("clickAction") String clickAction,
            @JsonProperty("icon") String icon,
            @JsonProperty("messageSubtitle") String messageSubtitle,
            @JsonProperty("badgeCount") Integer badgeCount,
            @JsonProperty("playSound") Boolean playSound) {
        super(baseEvent);
        this.baseEvent = baseEvent;
        this.userId = userId;
        this.messageTitle = messageTitle;
        this.messageBody = messageBody;
        this.data = data;
        this.clickAction = clickAction;
        this.icon = icon;
        this.messageSubtitle = messageSubtitle;
        this.badgeCount = badgeCount;
        this.playSound = playSound;
    }
}
