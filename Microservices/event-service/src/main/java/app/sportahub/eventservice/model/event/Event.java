package app.sportahub.eventservice.model.event;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.BaseEntity;
import app.sportahub.eventservice.model.event.participant.Participant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.EnumSet;
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

    @NotEmpty(message = "Start time must be provided")
    private LocalTime startTime;

    @NotEmpty(message = "End time must be provided")
    private LocalTime endTime;

    private String duration;

    @NotNull
    @Positive(message = "Maximum number of participants must be greater than 0")
    private Integer maxParticipants;

    @Builder.Default
    private List<Participant> participants = new ArrayList<>();

    @NotBlank(message = "Valid id of the user who created the event must be provided")
    private String createdBy;

    @Builder.Default
    private List<Team> teams = new ArrayList<>();

    @NotBlank(message = "Cut off time must be provided")
    private String cutOffTime;

    @NotBlank(message = "Description must be provided")
    private String description;

    @NotBlank(message = "Privacy setting must be provided")
    private Boolean isPrivate;

    @Builder.Default
    private List<String> whitelistedUsers = new ArrayList<>();

    @Builder.Default
    private EnumSet<SkillLevelEnum> requiredSkillLevel = EnumSet.allOf(SkillLevelEnum.class);
}