package app.sportahub.userservice.repository;

import app.sportahub.userservice.model.user.Badge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepository extends MongoRepository<Badge, String> {
}
