package app.sportahub.eventservice.dto.request;

import jakarta.validation.constraints.NotBlank;
public record EventCancellationRequest(
        @NotBlank(message = "Cancellation reason must be provided")
        String reason) {
}