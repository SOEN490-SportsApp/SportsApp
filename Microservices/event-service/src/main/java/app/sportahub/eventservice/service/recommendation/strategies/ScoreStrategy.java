package app.sportahub.eventservice.service.recommendation.strategies;

import java.util.List;
import java.util.Map;

import app.sportahub.eventservice.model.event.Event;

public interface ScoreStrategy {
    public Map<Event, Double> computeScores(List<Event> events);
} 