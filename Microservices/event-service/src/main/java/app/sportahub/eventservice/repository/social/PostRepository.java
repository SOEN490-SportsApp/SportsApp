package app.sportahub.eventservice.repository.social;

import app.sportahub.eventservice.model.social.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByEventId(String eventId, Pageable pageable);
}
