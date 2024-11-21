package app.sportahub.eventservice.model.event;

import app.sportahub.eventservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper=false)
@SuperBuilder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class Event extends BaseEntity {

    @NotBlank(message = "Event name must be provided")
    private String eventName;

    @NotBlank(message = "Event type must be provided")
    private String eventType;

    @NotBlank(message = "Sport type must be provided")
    private String sportType;

    private Location location;

    @NotBlank(message = "Date must be provided")
    private LocalDate date;

    @NotBlank(message = "Duration must be provided")
    private String duration;

    private List<Participant> participants;

    @NotBlank(message = "Valid id of the user who created the event must be provided")
    private String createdBy;

    private List<Team> teams;

    @NotBlank(message = "Cut of time must be provided")
    private String cutOffTime;

    @NotBlank(message = "Description must be provided")
    private String description;

    @NotBlank(message = "Privacy setting must be provided")
    private Boolean isPrivate;

    private List<String> whitelistedUsers;
}