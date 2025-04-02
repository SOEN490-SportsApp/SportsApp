package app.sportahub.eventservice.service.recommendation.strategies;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.participant.Participant;
import app.sportahub.eventservice.utils.Haversine;

public class HistoryScoreStrategy implements ScoreStrategy {

    private List<Event> userEventHistory;

    // score weights
    private static final double DISTANCE_WEIGHT = 2 / 5.0;
    private static final double CATEGORICAL_WEIGHT = 2 / 5.0;
    private static final double TIME_WEIGHT = 1 / 5.0;

    public HistoryScoreStrategy(List<Event> userEventHistory) {
        this.userEventHistory = userEventHistory;
    }

    @Override
    public Map<Event, Double> computeScores(List<Event> events) {
        Map<Event, Double> eventScores = events.parallelStream().collect(Collectors.toConcurrentMap(
                event -> event,
                event -> generateEventScore(event, userEventHistory)));

        return eventScores;
    }

    private double generateEventScore(Event event, List<Event> userEventHistoryList) {
        List<Double> eventScores = new ArrayList<>();
        userEventHistoryList.forEach(historyEvent -> {

            if (historyEvent.getId().equals(event.getId())) {
                return;
            }

            double distanceScore = haversineDistance(historyEvent, event) / 100;
            double timeScore = timeSimilarity(historyEvent, event);
            double categoricalScore = jaccardSimilarity(historyEvent, event);

            double score = DISTANCE_WEIGHT * distanceScore + CATEGORICAL_WEIGHT * categoricalScore
                    + timeScore * TIME_WEIGHT;

            eventScores.add(score);
        });

        double averageScore = eventScores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        return averageScore;
    }

    private double jaccardSimilarity(Event event1, Event event2) {
        Set<String> participants1 = event1.getParticipants().stream()
                .map(Participant::getUserId)
                .collect(Collectors.toSet());

        Set<String> participants2 = event2.getParticipants().stream()
                .map(Participant::getUserId)
                .collect(Collectors.toSet());

        Set<String> intersection = new HashSet<>(participants1);
        intersection.retainAll(participants2);
        Set<String> union = new HashSet<>(participants1);
        union.addAll(participants2);

        double participantScore = (double) intersection.size() / union.size();

        Set<String> skills1 = event1.getRequiredSkillLevel().stream()
                .map(SkillLevelEnum::toString)
                .collect(Collectors.toSet());

        Set<String> skills2 = event2.getRequiredSkillLevel().stream()
                .map(SkillLevelEnum::toString)
                .collect(Collectors.toSet());

        Set<String> intersectionSkills = new HashSet<>(skills1);
        intersectionSkills.retainAll(skills2);
        Set<String> unionSkills = new HashSet<>(skills1);
        unionSkills.addAll(skills2);

        double skillScore = (double) intersectionSkills.size() / unionSkills.size();

        double sportTypeScore = event1.getSportType().equalsIgnoreCase(event2.getSportType()) ? 1.0 : 0.0;
        double similarityScore = (participantScore + skillScore + sportTypeScore) / 3.0;

        return similarityScore;
    }

    private double timeSimilarity(Event event1, Event event2) {
        double startTimeScore = 1
                - Math.abs(event1.getStartTime().toSecondOfDay() - event2.getStartTime().toSecondOfDay()) / 86400.0;
        double duration1 = event1.getDuration().isEmpty() ? 0.0 : Double.parseDouble(event1.getDuration());
        double duration2 = event2.getDuration().isEmpty() ? 0.0 : Double.parseDouble(event2.getDuration());
        double durationScore = 1 - Math.abs(duration1 - duration2) / 24.0;
        double similarityScore = (startTimeScore + durationScore) / 2.0;

        return similarityScore;
    }

    private double haversineDistance(Event event1, Event event2) {
        return Haversine.EventHaversineDistance(event1, event2);
    }
}