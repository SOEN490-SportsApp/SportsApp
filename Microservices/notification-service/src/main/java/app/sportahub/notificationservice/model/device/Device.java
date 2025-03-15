package app.sportahub.notificationservice.model.device;

import app.sportahub.notificationservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("user_device")
@Data
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@NoArgsConstructor
@AllArgsConstructor
public class Device extends BaseEntity {

    @NotBlank
    private String userId;

    @NotBlank
    private String deviceToken;
}
