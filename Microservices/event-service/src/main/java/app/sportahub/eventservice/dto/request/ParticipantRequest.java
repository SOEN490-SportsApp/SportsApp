package app.sportahub.eventservice.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParticipantRequest(@NotBlank(message = "Valid user id must be provided")
                                 String userId,

                                 @NotBlank(message = "Attend status must be provided")
                                 String attendStatus,

                                 @NotBlank(message = "Date user joined must be provided")
                                 LocalDate joinedOn) {
}
