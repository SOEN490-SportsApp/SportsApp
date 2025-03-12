package app.sportahub.notificationservice.model.notification;

import app.sportahub.notificationservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("notification")
@Data
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {
    @NotBlank
    private String userId;
    @NotBlank
    private String message;
    @NotBlank
    private String type; // e.g., EVENT_CANCELLED, FRIEND_REQUEST_RECEIVED
    private boolean isRead;
}