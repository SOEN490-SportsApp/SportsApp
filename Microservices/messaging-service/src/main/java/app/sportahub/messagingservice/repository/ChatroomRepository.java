package app.sportahub.messagingservice.repository;

import app.sportahub.messagingservice.model.Chatroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface ChatroomRepository extends MongoRepository<Chatroom, String> {
    Optional<Chatroom> findByCreatedByAndMembersEquals(String senderId, Set<String> members);
}
