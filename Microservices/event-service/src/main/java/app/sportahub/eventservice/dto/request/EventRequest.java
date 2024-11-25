package app.sportahub.eventservice.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EventRequest(
                           @NotBlank(message = "Event name must be provided")
                           String eventName,

                           @NotBlank(message = "Event type must be provided")
                           String eventType,

                           @NotBlank(message = "Sport type must be provided")
                           String sportType,

                           @NotNull
                           LocationRequest location,

                           @NotNull(message = "Date must be provided")
                           LocalDate date,

                           @Nullable
                           String duration,

                           @Nullable
                           List<ParticipantRequest> participants,

                           @NotBlank(message = "Valid id of the user who created the event must be provided")
                           String createdBy,

                           @Nullable
                           List<TeamRequest> teams,

                           @NotBlank(message = "Cut of time must be provided")
                           String cutOffTime,

                           @NotBlank(message = "Description must be provided")
                           String description,

                           @Nullable
                           List<String> whitelistedUsers){

}
