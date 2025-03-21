package app.sportahub.userservice.service.recommendation;

import app.sportahub.userservice.model.interaction.Cluster;
import app.sportahub.userservice.model.user.Friend;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.SportLevel;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.interaction.ClusterRepository;
import app.sportahub.userservice.repository.user.UserRepository;
import app.sportahub.userservice.service.kafka.producer.OrchestrationServiceProducer;
import app.sportahub.userservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.keycloak.events.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendRecommendationService {
//
//    private UserRepository userRepository;
//    private OrchestrationServiceProducer orchestrationServiceProducer;
//
//    public List<User> getFriendRecommendations(String userId) {
//        User currentUser = userRepository.findById(userId).orElseThrow();
//
//        List<String> sports = currentUser.getProfile().getSportsOfPreference()
//                .stream().map(SportLevel::getName)
//                .collect(Collectors.toList());
//
//        List<String> skillLevels = currentUser.getProfile().getSportsOfPreference()
//                .stream().map(SportLevel::getRanking)
//                .collect(Collectors.toList());
//
//        List<String> eventIds = eventRepository.findAllByParticipantId(userId)
//                .stream().map(Event::getId)
//                .collect(Collectors.toList());
//
//        List<String> friendIds = currentUser.getFriendList()
//                .stream().map(Friend::getUserId)
//                .collect(Collectors.toList());
//
//        return userRepository.recommendFriends(
//                userId,
//                currentUser.getProfile().getPostalCode(),
//                sports,
//                currentUser.getProfile().getGender(),
//                friendIds,
//                eventIds,
//                skillLevels
//        );
//    }
}

//public class FriendRecommendationService {
//
//    private final UserRepository userRepository;
//    private final ClusterRepository clusterRepository;
//    private final MongoTemplate mongoTemplate;
//
//    @Scheduled(fixedRate = 86400000) // Run every 24 hours
//    public void batchProcessClusters() {
//        List<User> users = userRepository.findAll();
//        if (users.isEmpty()) return;
//
//        List<double[]> featureVectors = new ArrayList<>();
//        List<String> userIds = new ArrayList<>();
//
//        for (User user : users) {
//            featureVectors.add(extractFeatures(user));
//            userIds.add(user.getId());
//        }
//
//        double[][] data = featureVectors.toArray(new double[0][]);
//
//        // Perform X-Means clustering
//        XMeans xmeans = XMeans.fit(data, 2); // minClusters=2
//
//        int[] clusters = xmeans.y;
//        double[] centroids = xmeans.centroids();
//
//        // Save cluster assignments in users
//        for (int i = 0; i < userIds.size(); i++) {
//            User user = userRepository.findById(userIds.get(i)).orElse(null);
//            if (user != null) {
//                user.setClusterId(clusters[i]);
//            }
//        }
//        userRepository.saveAll(users);
//
//        // Save cluster model for incremental updates
//        Cluster cluster = new Cluster();
//        cluster.setCentroids(centroids);
//        cluster.setClusters(clusters);
//        clusterRepository.save(cluster);
//    }
//
//    public List<String> getFriendRecommendations(String userId) {
//        User user = userRepository.findById(userId).orElse(null);
//        if (user == null || user.getClusterId() == null) return Collections.emptyList();
//
//        int clusterId = user.getClusterId();
//        List<User> usersInCluster = userRepository.findByClusterId(clusterId);
//
//        return usersInCluster.stream()
//                .filter(u -> !u.getId().equals(userId))
//                .sorted(Comparator.comparingDouble(u -> -calculateSimilarity(user, u))) // Higher similarity first
//                .map(User::getId)
//                .collect(Collectors.toList());
//    }
//
//    public void assignNewUser(User newUser) {
//        Cluster cluster = (Cluster) clusterRepository.findTopByOrderByCreatedAtDesc();
//        if (cluster == null) {
//            newUser.setClusterId(0);
//            userRepository.save(newUser);
//            return;
//        }
//
//        double[] newUserFeatures = extractFeatures(newUser);
//        int closestCluster = findClosestCluster(newUserFeatures, cluster.getCentroids());
//
//        newUser.setClusterId(closestCluster);
//        userRepository.save(newUser);
//    }
//
//    public void updateClustersForNewInteractions() {
//        List<User> updatedUsers = userRepository.findUsersWithRecentActivity();
//
//        if (updatedUsers.isEmpty()) return;
//
//        Cluster cluster = (Cluster) clusterRepository.findTopByOrderByCreatedAtDesc();
//        if (cluster == null) {
//            batchProcessClusters();
//            return;
//        }
//
//        double[][] existingCentroids = cluster.getCentroids();
//        List<double[]> updatedFeatureVectors = updatedUsers.stream()
//                .map(this::extractFeatures)
//                .collect(Collectors.toList());
//
//        XMeans xmeans = new XMeans(existingCentroids); // Use existing centroids
//        int[] updatedClusters = xmeans.update(updatedFeatureVectors.toArray(new double[0][]));
//
//        for (int i = 0; i < updatedUsers.size(); i++) {
//            updatedUsers.get(i).setClusterId(updatedClusters[i]);
//        }
//        userRepository.saveAll(updatedUsers);
//    }
//
//    private double[] extractFeatures(User user) {
//        Profile profile = user.getProfile();
//        double normalizedRanking = normalizeRanking(profile.getRanking());
//
//        return new double[]{
//                user.getProfile().getPostalCode().hashCode(),
//                profile.getSportsOfPreference().size(),
//                normalizedRanking,
//                user.getEventsJoined(),
//                user.getFriendList().size(),
//                user.getProfile().getGender().equalsIgnoreCase("male") ? 1.0 : 0.0
//        };
//    }
//
//    private int findClosestCluster(double[] features, double[][] centroids) {
//        int bestCluster = -1;
//        double minDistance = Double.MAX_VALUE;
//
//        for (int i = 0; i < centroids.length; i++) {
//            double distance = euclideanDistance(centroids[i], features);
//            if (distance < minDistance) {
//                minDistance = distance;
//                bestCluster = i;
//            }
//        }
//        return bestCluster;
//    }
//
//    private double calculateSimilarity(User user1, User user2) {
//        double[] features1 = extractFeatures(user1);
//        double[] features2 = extractFeatures(user2);
//        return -euclideanDistance(features1, features2);
//    }
//
//    private double euclideanDistance(double[] a, double[] b) {
//        double sum = 0.0;
//        for (int i = 0; i < a.length; i++) {
//            sum += Math.pow(a[i] - b[i], 2);
//        }
//        return Math.sqrt(sum);
//    }
//
//    private double normalizeRanking(String ranking) {
//        switch (ranking.toLowerCase()) {
//            case "beginner":
//                return 0.0;
//            case "intermediate":
//                return 0.5;
//            case "advanced":
//                return 1.0;
//            default:
//                return 0.0;
//        }
//    }
//}
