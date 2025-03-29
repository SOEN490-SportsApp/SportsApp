package app.sportahub.eventservice.repository.social;

import app.sportahub.eventservice.model.social.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
}
