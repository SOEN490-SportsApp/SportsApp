package app.sportahub.eventservice.service.recommendation.strategies;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.user.UserProfile;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ProfileScoreStrategy implements ScoreStrategy {

    private UserProfile user;

    public ProfileScoreStrategy(UserProfile user) {
        this.user = user;
    }

    @Override
    public Map<Event, Double> computeScores(List<Event> events) {
        log.info("ProfileScoreStrategy::computeScores: computing scores for {} events with user profile {}",
                events.size(), user);
        Map<Event, Double> eventScores = events.parallelStream().collect(Collectors.toConcurrentMap(
                event -> event,
                event -> generateEventScore(event)));
        return eventScores;
    }

    private double generateEventScore(Event event) {
        if (user.getProfile() == null || user.getProfile().getSportsOfPreference().isEmpty()) {
            log.info("ProfileScoreStrategy::generateEventScore: user has no sports of preference, returning 0.0");
            return 0.0;
        }

        log.info(
                "ProfileScoreStrategy::generateEventScore: user has sports of preference, calculating score for event {}",
                event);
        Map<String, SkillLevelEnum> sports = user.getProfile().getSportsOfPreference().stream()
                .collect(Collectors.toMap(
                        sport -> sport.getSport().toLowerCase().trim(),
                        sport -> sport.getRanking()));

        Integer score = 0;
        if (sports.containsKey(event.getSportType().toLowerCase().trim())) {
            score += 1;
            if (event.getRequiredSkillLevel().contains(sports.get(event.getSportType()))) {
                score += 1;
            }
        }

        return score == 0 ? 0.0 : score / 2.0;
    }
}