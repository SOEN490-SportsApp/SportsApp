package app.sportahub.eventservice.model.event;

import app.sportahub.eventservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper=false)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
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

    @NotNull
    private Location location;

    @NotEmpty(message = "Date must be provided")
    private LocalDate date;

    private String duration;

    @Builder.Default
    private List<Participant> participants = new ArrayList<>();

    @NotBlank(message = "Valid id of the user who created the event must be provided")
    private String createdBy;

    @Builder.Default
    private List<Team> teams = new ArrayList<>();

    @NotBlank(message = "Cut of time must be provided")
    private String cutOffTime;

    @NotBlank(message = "Description must be provided")
    private String description;

    @NotBlank(message = "Privacy setting must be provided")
    private Boolean isPrivate;

    @Builder.Default
    private List<String> whitelistedUsers = new ArrayList<>();
}