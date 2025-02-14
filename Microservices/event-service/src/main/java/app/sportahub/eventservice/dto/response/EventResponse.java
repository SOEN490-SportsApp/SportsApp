package app.sportahub.eventservice.dto.response;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.EventCancellation;
import app.sportahub.eventservice.model.event.Team;
import app.sportahub.eventservice.model.social.Post;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EventResponse(String id, Timestamp creationDate, String eventName, String eventType, String sportType,
                            LocationResponse locationResponse, LocalDate date, LocalTime startTime, LocalTime endTime,
                            String duration, Integer maxParticipants, List<ParticipantResponse> participants, List<ReactorResponse> reactors,
                            String createdBy, List<Team> teams, String cutOffTime, String description,
                            Boolean isPrivate, List<String> whitelistedUsers,
                            EnumSet<SkillLevelEnum> requiredSkillLevel, List<Post> posts,
                            EventCancellation cancellation) {
}
