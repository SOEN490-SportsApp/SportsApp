package app.sportahub.userservice.service.recommendation;

import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.Friend;
import app.sportahub.userservice.model.user.SportLevel;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.user.UserRepository;
import app.sportahub.userservice.service.kafka.producer.OrchestrationServiceProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendRecommendationService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final OrchestrationServiceProducer orchestrationServiceProducer;

    public List<UserResponse> getFriendRecommendations(String userId) {
        User currentUser = userRepository.findById(userId).orElseThrow();

        List<String> sports = currentUser.getProfile().getSportsOfPreference()
                .stream().map(SportLevel::getName)
                .collect(Collectors.toList());

        List<String> skillLevels = currentUser.getProfile().getSportsOfPreference()
                .stream().map(SportLevel::getRanking)
                .collect(Collectors.toList());

        List<String> eventIds = orchestrationServiceProducer.getEventsJoinedByUser(userId);

        List<String> friendIds = currentUser.getFriendList()
                .stream().map(Friend::getUserId)
                .collect(Collectors.toList());

        List <User> users = userRepository.recommendFriends(
                userId,
                currentUser.getProfile().getPostalCode(),
                sports,
                currentUser.getProfile().getGender(),
                friendIds,
                eventIds,
                skillLevels
        );

        return users.stream()
                .map(userMapper::userToUserResponse)
                .collect(Collectors.toList());
    }
}