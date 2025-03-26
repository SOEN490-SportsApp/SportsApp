package app.sportahub.messagingservice.repository;

import app.sportahub.messagingservice.model.Chatroom;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ChatroomRepository extends MongoRepository<Chatroom, String> {
    Optional<Chatroom> findByCreatedByAndChatroomNameAndMembersEquals(String senderId,
                                                                      String chatroomName, Set<String> members);

    List<Chatroom> findAllByMembersContains(@NotEmpty @Size(min = 1, max = 255) Set<String> members);
    Optional<Chatroom> findByChatroomId(String chatroomId);
}
