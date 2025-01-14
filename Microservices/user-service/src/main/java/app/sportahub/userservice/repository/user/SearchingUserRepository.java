package app.sportahub.userservice.repository.user;

import app.sportahub.userservice.model.user.User;
import io.micrometer.observation.annotation.Observed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Observed
public interface SearchingUserRepository {
    Page<User> searchUsers(String firstName, String lastName, List<String> sports, List<String> rankings, String gender, String age, Pageable pageable);
}
