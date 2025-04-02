package app.sportahub.userservice.service.recommendation;

import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.Friend;
import app.sportahub.userservice.model.user.SportLevel;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.user.UserRepository;
import app.sportahub.userservice.service.kafka.producer.OrchestrationServiceProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class responsible for computing friend recommendations for users.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FriendRecommendationService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final OrchestrationServiceProducer orchestrationServiceProducer;

    /**
     * Scheduled task that computes friend recommendations for all users.
     * This method runs daily at midnight.
     */
    @Scheduled(cron = "0 0 0 * * ?") // Run every day at midnight
    public void computeFriendRecommendationsForAllUsers() {
        log.info("Starting daily friend recommendations computation...");

        List<User> users = userRepository.findAll();

        users.forEach(user -> {
            List<String> recommendedFriendIds = computeFriendRecommendations(user);
            user.setRecommendedFriends(recommendedFriendIds);
            userRepository.save(user);
        });

        log.info("Finished daily friend recommendations computation.");
    }

    /**
     * Computes a list of recommended friends for a given user based on their
     * sports preferences, skill levels, events attended, and existing friends.
     *
     * @param user The user for whom friend recommendations are being computed.
     * @return A list of user IDs representing recommended friends.
     */
    private List<String> computeFriendRecommendations(User user) {
        List<String> sports = user.getProfile().getSportsOfPreference()
                .stream().map(SportLevel::getName)
                .collect(Collectors.toList());

        List<String> skillLevels = user.getProfile().getSportsOfPreference()
                .stream().map(SportLevel::getRanking)
                .collect(Collectors.toList());

        List<String> eventIds = orchestrationServiceProducer.getEventsJoinedByUser(user.getId());

        List<String> friendIds = user.getFriendList()
                .stream().map(Friend::getUserId)
                .collect(Collectors.toList());

        List<User> recommendedUsers = userRepository.recommendFriends(
                user.getId(),
                user.getProfile().getPostalCode(),
                sports,
                user.getProfile().getGender(),
                friendIds,
                eventIds,
                skillLevels
        );

        List<User> filteredRecommendedUsers = recommendedUsers.stream()
                .filter(recommendedUser -> !friendIds.contains(recommendedUser.getId()))
                .toList();

        return filteredRecommendedUsers.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }
}