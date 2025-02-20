package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class SearchingEventRepositoryImpl implements SearchingEventRepository {
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Event> searchEvent(String eventName, String eventType, String sportType, Location location, LocalDate date, LocalTime startTime, LocalTime endTime, String duration, Integer maxParticipants, String createdBy, Boolean isPrivate, List<String> requiredSkillLevel, Pageable pageable) {
        Query query = new Query();

        if (eventName != null) {
            query.addCriteria(Criteria.where("eventName").regex(eventName, "i"));
        }
        if (eventType != null) {
            query.addCriteria(Criteria.where("eventType").regex(eventType, "i"));
        }
        if (sportType != null) {
            query.addCriteria(Criteria.where("sportType").regex(sportType, "i"));
        }
        if (location != null) {
            query.addCriteria(Criteria.where("location").is(location));
        }
        if (date != null) {
            query.addCriteria(Criteria.where("date").is(date));
        }
        if (startTime != null) {
            query.addCriteria(Criteria.where("startTime").is(startTime));
        }
        if (endTime != null) {
            query.addCriteria(Criteria.where("endTime").is(endTime));
        }
        if (duration != null) {
            query.addCriteria(Criteria.where("duration").is(duration));
        }
        if (maxParticipants != null) {
            query.addCriteria(Criteria.where("maxParticipants").is(maxParticipants));
        }
        if (createdBy != null) {
            query.addCriteria(Criteria.where("createdBy").is(createdBy));
        }
        if (isPrivate != null) {
            query.addCriteria(Criteria.where("isPrivate").is(isPrivate));
        }
        if (requiredSkillLevel != null && !requiredSkillLevel.isEmpty()) {

            List<String> skillLevelsLower = requiredSkillLevel.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());

            query.addCriteria(Criteria.where("requiredSkillLevel").in(skillLevelsLower));
        }

        Query countQuery = Query.of(query);
        long total = mongoTemplate.count(countQuery, Event.class);

        query.with(pageable);
        List<Event> events = mongoTemplate.find(query, Event.class);

        return new PageImpl<>(events, pageable, total);
    }
}
