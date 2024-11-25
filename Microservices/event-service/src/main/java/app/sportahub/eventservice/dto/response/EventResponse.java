package app.sportahub.eventservice.dto.response;

import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.Participant;
import app.sportahub.eventservice.model.event.Team;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EventResponse(String id, String eventName, String eventType, String sportType, Location location,
                            LocalDate date, String duration, List<Participant> participants, String createdBy,
                            List<Team> teams, String cutOffTime, String description, Boolean isPrivate,
                            List<String> whitelistedUsers) {
}
