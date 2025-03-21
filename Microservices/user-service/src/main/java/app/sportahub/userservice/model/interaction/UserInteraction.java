package app.sportahub.userservice.model.interaction;

import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@Document("userInteraction")
@ToString
@Data
public class UserInteraction extends BaseEntity {
    @Id
    @NotNull
    private String userId;

    @NotNull
    private int eventsJoined;

    @NotNull
    private int friendsAdded;
}