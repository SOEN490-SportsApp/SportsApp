package app.sportahub.eventservice.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TeamRequest(@NotBlank(message = "Valid team id must be provided.") String teamId) {
}
