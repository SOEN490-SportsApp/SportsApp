package app.sportahub.userservice.repository;

import app.sportahub.userservice.model.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findUserById(String id);

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    User findUserByEmailOrUsername(String email, String username);
}
