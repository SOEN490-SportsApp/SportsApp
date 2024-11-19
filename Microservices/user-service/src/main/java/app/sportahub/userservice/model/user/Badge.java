package app.sportahub.userservice.model.user;

import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder(setterPrefix = "with")
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Document("badge")
@Data
public class Badge extends BaseEntity {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    private String iconUrl;
}
