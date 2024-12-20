package app.sportahub.eventservice.dto.response;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.Participant;
import app.sportahub.eventservice.model.event.Team;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EventResponse(String id, String eventName, String eventType, String sportType, LocationResponse locationResponse,
                            LocalDate date, String duration, List<Participant> participants, String createdBy,
                            List<Team> teams, String cutOffTime, String description, Boolean isPrivate,
                            List<String> whitelistedUsers, EnumSet<SkillLevelEnum> requiredSkillLevel) {
}
