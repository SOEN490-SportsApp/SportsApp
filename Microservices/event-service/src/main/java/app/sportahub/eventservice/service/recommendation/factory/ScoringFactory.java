package app.sportahub.eventservice.service.recommendation.factory;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.user.UserProfile;
import app.sportahub.eventservice.service.kafka.producer.OrchestrationServiceProducer;
import app.sportahub.eventservice.service.recommendation.strategies.HistoryScoreStrategy;
import app.sportahub.eventservice.service.recommendation.strategies.ProfileScoreStrategy;
import app.sportahub.eventservice.service.recommendation.strategies.ScoreStrategy;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class ScoringFactory {

    private final OrchestrationServiceProducer orchestrationServiceProducer;

    public ScoringFactory(OrchestrationServiceProducer orchestrationServiceProducer) {
        this.orchestrationServiceProducer = orchestrationServiceProducer;
    }

    public ScoreStrategy getScoringStrategy(List<Event> userEventHistory, String userId) {
        if(userEventHistory.isEmpty()){
            ObjectMapper objectMapper = new ObjectMapper();
            String userString = orchestrationServiceProducer.getUserById(userId);
            log.info("ScoringFactory::getScoringStrategy: user string {}", userString);
            UserProfile userProfile;
            try {
                userProfile = objectMapper.readValue(userString, UserProfile.class);
                log.info("ScoringFactory::getScoringStrategy: user profile  {}", userProfile);
            } catch (JsonProcessingException e) {
   
                log.error("Error processing JSON for user data", e);
                throw new RuntimeException("Error processing JSON for user data");
            }
            
            log.info("ScoringFactory::getScoringStrategy: user retrieved {}", userProfile);
            return new ProfileScoreStrategy(userProfile);
            
        } else {
            return new HistoryScoreStrategy(userEventHistory);
        }
    }
}