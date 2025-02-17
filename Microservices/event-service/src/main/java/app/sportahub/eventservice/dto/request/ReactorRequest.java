package app.sportahub.eventservice.dto.request;

import app.sportahub.eventservice.model.event.reactor.ReactionType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ReactorRequest(
        @NotBlank(message = "Valid user id must be provided")
        String userId,

        @NotBlank(message = "Reaction type must be provided")
        ReactionType reactionType,

        @NotBlank(message = "Date user reacted must be provided")
        LocalDateTime reactedOn
) {
}