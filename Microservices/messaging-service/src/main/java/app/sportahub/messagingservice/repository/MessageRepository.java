package app.sportahub.messagingservice.repository;

import app.sportahub.messagingservice.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findAllBySenderIdAndReceiverIds(String senderId, Set<String> receiverId);
}
