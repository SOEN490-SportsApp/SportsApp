package app.sportahub.userservice.repository;

import app.sportahub.userservice.model.user.Friend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendRepository extends MongoRepository<Friend, String> {

    Optional<Friend> findFriendByUsername(String username);

    Optional<Friend> findFriendById(String id);
}
