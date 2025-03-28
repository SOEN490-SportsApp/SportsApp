package app.sportahub.eventservice.service.recommendation;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.service.kafka.producer.OrchestrationServiceProducer;
import app.sportahub.eventservice.service.recommendation.factory.ScoringFactory;
import app.sportahub.eventservice.service.recommendation.strategies.ScoreStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("recommendationService")
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService{

    private final EventRepository eventRepository;
    private final OrchestrationServiceProducer orchestrationServiceProducer;
    private final EventMapper eventMapper;

    @Override
    public Page<EventResponse> getRecommendations(String userId, double longitude, double latitude, double radius, int page, int size) {
        GeoJsonPoint point = new GeoJsonPoint(longitude, latitude);
        Distance distance = new Distance(radius, Metrics.KILOMETERS);
        Pageable pageable = PageRequest.of(page, size);
        List<Event> eventsList = eventRepository.findByLocationCoordinatesNear(point, distance, pageable).getContent()
                                                .stream()
                                                .collect(Collectors.toList());
                                                
        eventsList.removeIf(event -> !(event.getIsPrivate() && event.getWhitelistedUsers().contains(userId) )
                            || isEventCutOffTimePassed(event.getCutOffTime()));
        
        if(eventsList.isEmpty()) {
            log.info("RecommendationServiceImpl::getRecommendations: no valid events found for user {}", userId);
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }
        log.info("RecommendationServiceImpl::getRecommendations: found {} events for user {}", eventsList.size(), userId);

        List<Event> userEventHistoryList = eventRepository.findAllByParticipantUserId(userId);

        ScoreStrategy scoreService = new ScoringFactory(orchestrationServiceProducer).getScoringStrategy(userEventHistoryList, userId);
        log.info("RecommendationServiceImpl::getRecommendations: Strategy used for calculating recommendation scores:  {}", scoreService.getClass().getSimpleName());
        Map<Event, Double> eventScores = scoreService.computeScores(eventsList);
        
        List<EventResponse> eventResponse = eventScores.entrySet().parallelStream()
            .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
            .map(Map.Entry::getKey)
            .map(eventMapper::eventToEventResponse)
            .collect(Collectors.toList());
        
        log.info("RecommendationServiceImpl::getRecommendations: returning {} events for user {}", eventResponse.size(), userId);
        int fromIndex = (int) pageable.getOffset() > eventResponse.size() ? eventResponse.size() : (int) pageable.getOffset();
        int toIndex = Math.min(fromIndex + size, eventResponse.size());
        if (fromIndex > toIndex) {
            fromIndex = toIndex;
        }
        return new PageImpl<>(eventResponse.subList(fromIndex, toIndex), pageable, eventResponse.size());
    }
    
    private boolean isEventCutOffTimePassed(String cutOffTime) {
        try{
            LocalDateTime currentTime = LocalDateTime.now();
            // handle for offset time
            if(cutOffTime.contains("+") || cutOffTime.charAt(cutOffTime.length()-6) == '-' || cutOffTime.contains("Z")) {
                ZoneId localZoneId = ZoneId.systemDefault();
                ZoneOffset localZoneOffset = localZoneId.getRules().getOffset(currentTime);
                OffsetDateTime currentOffsetDateTime = currentTime.atOffset(localZoneOffset);
                return OffsetDateTime.parse(cutOffTime).isBefore(currentOffsetDateTime);
            } 
            // handle for local time
            else {
                return LocalDateTime.parse(cutOffTime).isBefore(currentTime);
            }

        } catch (DateTimeParseException  e) {
            return false;
        }
    }       
}    