package app.sportahub.notificationservice.model.notification;

import app.sportahub.notificationservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("notification")
@Data
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {

    @NotBlank
    private String userId;

    @NotBlank
    String messageTitle;

    @NotBlank
    String messageBody;

    Map<String, String> data;

    private String clickAction;

    private String icon;

    String messageSubtitle;

    Integer badgeCount;

    Boolean playSound;

    @Builder.Default
    private Boolean isRead = false;
}
