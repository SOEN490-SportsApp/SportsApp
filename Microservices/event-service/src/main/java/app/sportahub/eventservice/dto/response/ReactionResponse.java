package app.sportahub.eventservice.dto.response;

import app.sportahub.eventservice.model.event.reactor.ReactionType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ReactionResponse(
        @NotBlank(message = "Valid user id must be provided")
        String userId,

        @NotBlank(message = "Reaction type must be provided")
        ReactionType reactionType
) {
}