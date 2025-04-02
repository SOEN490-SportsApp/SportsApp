package app.sportahub.eventservice.factory;

import java.util.List;

import app.sportahub.eventservice.mapper.user.UserProfileMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.user.UserProfile;
import app.sportahub.eventservice.service.kafka.producer.OrchestrationServiceProducer;
import app.sportahub.eventservice.service.recommendation.strategies.HistoryScoreStrategy;
import app.sportahub.eventservice.service.recommendation.strategies.ProfileScoreStrategy;
import app.sportahub.eventservice.service.recommendation.strategies.ScoreStrategy;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ScoringFactory {
    
    private final UserProfileMapper userProfileMapper;
    private final OrchestrationServiceProducer orchestrationServiceProducer;

    public ScoringFactory(OrchestrationServiceProducer orchestrationServiceProducer) {
        this.orchestrationServiceProducer = orchestrationServiceProducer;
        this.userProfileMapper = new UserProfileMapper();
    }

    public ScoreStrategy getScoringStrategy(List<Event> userEventHistory, String userId) {
        if (userEventHistory.isEmpty()) {
            String userString = orchestrationServiceProducer.getUserById(userId);
            UserProfile userProfile = userProfileMapper.userStringToUserProfile(userString);
            log.info("ScoringFactory::getScoringStrategy: user retrieved {}", userProfile);
            return new ProfileScoreStrategy(userProfile);
        } else {
            return new HistoryScoreStrategy(userEventHistory);
        }
    }
}