package app.sportahub.userservice.service.user;

import app.sportahub.userservice.exception.user.UserEmailAlreadyExists;
import app.sportahub.userservice.exception.user.UsernameAlreadyExists;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import app.sportahub.userservice.dto.request.user.UserRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(UserRequest userRequest) {
        Optional<User> optionalUserByEmail = Optional.ofNullable(userRepository.findUserByEmail(userRequest.email()));
        if (optionalUserByEmail.isPresent()) {
            throw new UserEmailAlreadyExists(userRequest.email());
        }

        Optional<User> optionalUserByUsername = Optional
                .ofNullable(userRepository.findUserByUsername(userRequest.username()));
        if (optionalUserByUsername.isPresent()) {
            throw new UsernameAlreadyExists(userRequest.username());
        }

        User user = User.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withEmail(userRequest.email())
                .withUsername(userRequest.username())
                .withProfile(Profile.builder()
                        .withFirstName(userRequest.firstName())
                        .withLastName(userRequest.lastName())
                        .withDateOfBirth(userRequest.dateOfBirth())
                        .withPhoneNumber(userRequest.phoneNumber())
                        .withRanking(userRequest.ranking())
                        .build())
                .build();
        User savedUser = userRepository.save(user);
        log.info("UserServiceImpl::createUser: User with id:{} was successfully created", savedUser.getId());
        return savedUser;
    }
}
