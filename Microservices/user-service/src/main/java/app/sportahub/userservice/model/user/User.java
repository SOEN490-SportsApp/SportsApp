package app.sportahub.userservice.model.user;

import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
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

    @Builder.Default
    private Profile profile = Profile.builder().build();

    @Builder.Default
    private Preferences preferences = Preferences.builder().build();

    @Builder.Default
    private List<FriendRequest> friendRequestList = new ArrayList<>();

    @Builder.Default
    private List<Friend> friendList = new ArrayList<>();
}
