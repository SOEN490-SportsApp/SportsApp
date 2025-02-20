package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SearchingEventRepository {
    Page<Event> searchEvent(String eventName, String eventType, String sportType, Location location, LocalDate date, LocalTime startTime, LocalTime endTime, String duration, Integer maxParticipants, String createdBy, Boolean isPrivate, List<String> requiredSkillLevel, Pageable pageable);

}
