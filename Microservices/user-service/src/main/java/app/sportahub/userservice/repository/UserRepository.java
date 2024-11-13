package app.sportahub.userservice.repository;

import app.sportahub.userservice.model.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findUserById(String id);

    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByUsername(String username);
}
