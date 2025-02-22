package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.dto.request.LocationRequest;
import app.sportahub.eventservice.enums.SkillLevelEnum;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class SearchingEventRepositoryImpl implements SearchingEventRepository {
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Event> searchEvent(String eventName,
                                   String eventType,
                                   String sportType,
                                   String locationName,
                                   String city,
                                   String province,
                                   String country,
                                   String postalCode,
                                   String date,
                                   String startTime,
                                   String endTime,
                                   String duration,
                                   String maxParticipants,
                                   String createdBy,
                                   Boolean isPrivate,
                                   List<SkillLevelEnum> requiredSkillLevel,
                                   Pageable pageable) {
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
        if (locationName != null) {
            query.addCriteria(Criteria.where("location.name").regex(locationName, "i"));
        }
        if (city != null) {
            query.addCriteria(Criteria.where("location.city").regex(city, "i"));
        }
        if (province != null) {
            query.addCriteria(Criteria.where("location.province").regex(province, "i"));
        }
        if (country != null) {
            query.addCriteria(Criteria.where("location.country").regex(country, "i"));
        }
        if (postalCode != null) {
            query.addCriteria(Criteria.where("location.postalCode").regex(postalCode, "i"));
        }
        if (date != null) {
            applyDateCriteria(query, date);
        }
        if (startTime != null) {
            applyTimeCriteria(query, startTime, "startTime");
        }
        if (endTime != null) {
            applyTimeCriteria(query, endTime, "endTime");
        }
        if (duration != null) {
            applyNumericCriteria(query, duration, "duration");
        }
        if (maxParticipants != null) {
            applyNumericCriteria(query, maxParticipants, "maxParticipants");
        }
        if (createdBy != null) {
            query.addCriteria(Criteria.where("createdBy").is(createdBy));
        }
        if (isPrivate != null) {
            query.addCriteria(Criteria.where("isPrivate").is(isPrivate));
        }
        if (requiredSkillLevel != null && !requiredSkillLevel.isEmpty()) {
            List<String> skillLevelStrings = requiredSkillLevel.stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());
            query.addCriteria(Criteria.where("requiredSkillLevel").in(skillLevelStrings));
        }

        Query countQuery = Query.of(query);
        long total = mongoTemplate.count(countQuery, Event.class);

        query.with(pageable);
        List<Event> events = mongoTemplate.find(query, Event.class);

        return new PageImpl<>(events, pageable, total);
    }

    private void applyDateCriteria(Query query, String dateRange) {
        Pattern rangePattern = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})-(\\d{4}-\\d{2}-\\d{2})");
        Matcher rangeMatcher = rangePattern.matcher(dateRange);

        if (rangeMatcher.matches()) {
            LocalDate startDate = LocalDate.parse(rangeMatcher.group(1));
            LocalDate endDate = LocalDate.parse(rangeMatcher.group(2));
            query.addCriteria(Criteria.where("date").gte(startDate).lte(endDate));
        } else {
            Pattern pattern = Pattern.compile("([<>=]{1,2})?(\\d{4}-\\d{2}-\\d{2})");
            Matcher matcher = pattern.matcher(dateRange);

            if (matcher.find()) {
                String operator = matcher.group(1) != null ? matcher.group(1) : "=";
                LocalDate dateValue = LocalDate.parse(matcher.group(2));

                switch (operator) {
                    case "<":
                        query.addCriteria(Criteria.where("date").lt(dateValue));
                        break;
                    case ">":
                        query.addCriteria(Criteria.where("date").gt(dateValue));
                        break;
                    case "<=":
                        query.addCriteria(Criteria.where("date").lte(dateValue));
                        break;
                    case ">=":
                        query.addCriteria(Criteria.where("date").gte(dateValue));
                        break;
                    case "=":
                        query.addCriteria(Criteria.where("date").is(dateValue));
                        break;
                    default:
                        throw new IllegalArgumentException("Unsupported operator in date filter: " + operator);
                }
            } else {
                throw new IllegalArgumentException("Invalid date format: " + dateRange);
            }
        }
    }

    private void applyTimeCriteria(Query query, String timeRange, String field) {
        Pattern rangePattern = Pattern.compile("(\\d{2}:\\d{2})-(\\d{2}:\\d{2})");
        Matcher rangeMatcher = rangePattern.matcher(timeRange);

        if (rangeMatcher.matches()) {
            LocalTime startTime = LocalTime.parse(rangeMatcher.group(1));
            LocalTime endTime = LocalTime.parse(rangeMatcher.group(2));
            query.addCriteria(Criteria.where(field).gte(startTime).lte(endTime));
        } else {
            Pattern pattern = Pattern.compile("([<>=]{1,2})?(\\d{2}:\\d{2})");
            Matcher matcher = pattern.matcher(timeRange);

            if (matcher.find()) {
                String operator = matcher.group(1) != null ? matcher.group(1) : "=";
                LocalTime timeValue = LocalTime.parse(matcher.group(2));

                switch (operator) {
                    case "<":
                        query.addCriteria(Criteria.where(field).lt(timeValue));
                        break;
                    case ">":
                        query.addCriteria(Criteria.where(field).gt(timeValue));
                        break;
                    case "<=":
                        query.addCriteria(Criteria.where(field).lte(timeValue));
                        break;
                    case ">=":
                        query.addCriteria(Criteria.where(field).gte(timeValue));
                        break;
                    case "=":
                        query.addCriteria(Criteria.where(field).is(timeValue));
                        break;
                    default:
                        throw new IllegalArgumentException("Unsupported operator in time filter: " + operator);
                }
            } else {
                throw new IllegalArgumentException("Invalid time format: " + timeRange);
            }
        }
    }

    private void applyNumericCriteria(Query query, String valueRange, String field) {
        Pattern rangePattern = Pattern.compile("(\\d+)-(\\d+)");
        Matcher rangeMatcher = rangePattern.matcher(valueRange);

        if (rangeMatcher.matches()) {
            int minValue = Integer.parseInt(rangeMatcher.group(1));
            int maxValue = Integer.parseInt(rangeMatcher.group(2));
            query.addCriteria(Criteria.where(field).gte(minValue).lte(maxValue));
        } else {
            Pattern pattern = Pattern.compile("([<>=]{1,2})?(\\d+)");
            Matcher matcher = pattern.matcher(valueRange);

            if (matcher.find()) {
                String operator = matcher.group(1) != null ? matcher.group(1) : "=";
                int value = Integer.parseInt(matcher.group(2));

                switch (operator) {
                    case "<":
                        query.addCriteria(Criteria.where(field).lt(value));
                        break;
                    case ">":
                        query.addCriteria(Criteria.where(field).gt(value));
                        break;
                    case "<=":
                        query.addCriteria(Criteria.where(field).lte(value));
                        break;
                    case ">=":
                        query.addCriteria(Criteria.where(field).gte(value));
                        break;
                    case "=":
                        query.addCriteria(Criteria.where(field).is(value));
                        break;
                    default:
                        throw new IllegalArgumentException("Unsupported operator in filter: " + operator);
                }
            } else {
                throw new IllegalArgumentException("Invalid format for field: " + valueRange);
            }
        }
    }
}
