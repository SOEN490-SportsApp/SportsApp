package app.sportahub.eventservice.service.recommendation;

import org.springframework.data.domain.Page;

import app.sportahub.eventservice.dto.response.EventResponse;

public interface RecommendationService {

    public Page<EventResponse> getRecommendations(String userId, double longitude, double latitude, double radius, int page, int size); 

}