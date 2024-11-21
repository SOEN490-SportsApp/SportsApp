package app.sportahub.eventservice.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EventRequest(@NotBlank String id,

                           @NotBlank(message = "Event name must be provided")
                           String eventName,

                           @NotBlank(message = "Event type must be provided")
                           String eventType,

                           @NotBlank(message = "Sport type must be provided")
                           String sportType,

                           @NotNull
                           LocationRequest location,

                           @NotBlank(message = "Date must be provided")
                           LocalDate date,

                           @NotBlank(message = "Duration must be provided")
                           String duration,

                           @NotNull
                           List<ParticipantRequest> participants,

                           @NotBlank(message = "Valid id of the user who created the event must be provided")
                           String createdBy,

                           @NotNull
                           List<TeamRequest> teams,

                           @NotBlank(message = "Cut of time must be provided")
                           String cutOffTime,

                           @NotBlank(message = "Description must be provided")
                           String description,

                           List<String> whitelistedUsers){

}
