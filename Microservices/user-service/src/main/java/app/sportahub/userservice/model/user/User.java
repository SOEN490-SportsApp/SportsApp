package app.sportahub.userservice.model.user;

import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = false)
@SuperBuilder(setterPrefix = "with")
@Document("user")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class User extends BaseEntity {

    @NotBlank
    private String keycloakId;

    @NotBlank(message = "Email must be provided")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Username must be provided")
    private String username;

    private Profile profile;
    private Preferences preferences;
}
