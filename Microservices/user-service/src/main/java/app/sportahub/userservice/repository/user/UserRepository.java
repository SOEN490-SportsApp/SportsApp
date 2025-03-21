package app.sportahub.userservice.repository.user;

import app.sportahub.userservice.model.user.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>, SearchingUserRepository {

    Optional<User> findUserById(String id);

    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByUsername(String username);

    @Aggregation(pipeline = {
            "{ $match: { _id: { $ne: ?0 }, 'profile.postalCode': ?1, 'profile.sportsOfPreference.name': { $in: ?2 }, 'profile.gender': ?3 } }",
            "{ $addFields: { mutualFriendsCount: { $size: { $setIntersection: [ { $ifNull: ['$friendList.userId', []] }, ?4 ] } } } }",
            "{ $addFields: { mutualEventsCount: { $size: { $setIntersection: [ { $ifNull: ['$eventIds', []] }, ?5 ] } } } }",
            "{ $addFields: { skillMatchScore: { $size: { $setIntersection: [ { $ifNull: ['$profile.sportsOfPreference.ranking', []] }, ?6 ] } } } }",
            "{ $sort: { mutualFriendsCount: -1, mutualEventsCount: -1, skillMatchScore: -1 } }",
            "{ $limit: 10 }"
    })
    List<User> recommendFriends(
            String userId,
            String postalCode,
            List<String> sportsOfPreference,
            String gender,
            List<String> friendIds,
            List<String> eventIds,
            List<String> skillLevels
    );
}
