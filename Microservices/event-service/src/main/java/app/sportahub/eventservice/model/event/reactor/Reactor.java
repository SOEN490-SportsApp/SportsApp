package app.sportahub.eventservice.model.event.reactor;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Reactor {
    @NotBlank(message = "Valid user id must be provided")
    private String userId;

    @Field
    private ReactionType reactionType;

    @NotBlank(message = "Date user last reacted must be provided")
    private LocalDate reactionDate;
}
