package app.sportahub.userservice.repository.user;

import app.sportahub.userservice.model.user.User;
import io.micrometer.observation.annotation.Observed;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Observed
public interface UserRepository extends MongoRepository<User, String>, SearchingUserRepository {

    Optional<User> findUserById(String id);

    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByUsername(String username);
}
