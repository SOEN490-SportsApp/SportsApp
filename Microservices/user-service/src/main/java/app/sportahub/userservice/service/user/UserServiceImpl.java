package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.model.user.Preferences;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
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
    private final ProfileMapper profileMapper;
    private final KeycloakApiClient keycloakApiClient;

    @Override
    public User createUser(UserRequest userRequest) {
        Optional<User> optionalUserByEmail = Optional.ofNullable(userRepository.findUserByEmail(userRequest.email()));
        if (optionalUserByEmail.isPresent()) {
            throw new UserEmailAlreadyExistsException(userRequest.email());
        }

        Optional<User> optionalUserByUsername = Optional
                .ofNullable(userRepository.findUserByUsername(userRequest.username()));
        if (optionalUserByUsername.isPresent()) {
            throw new UsernameAlreadyExistsException(userRequest.username());
        }

        User user = User.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withEmail(userRequest.email())
                .withUsername(userRequest.username())
                .withProfile(userRequest.profile() != null
                        ? Profile.builder()
                        .withFirstName(userRequest.profile().firstName())
                        .withLastName(userRequest.profile().lastName())
                        .withDateOfBirth(userRequest.profile().dateOfBirth())
                        .withPhoneNumber(userRequest.profile().phoneNumber())
                        .withRanking(userRequest.profile().ranking())
                        .build()
                        : null)
                .withPreferences(userRequest.preferences() != null
                        ? Preferences.builder()
                        .notifications(userRequest.preferences().notifications())
                        .language(userRequest.preferences().language())
                        .build()
                        : null)
                .build();

        User savedUser = userRepository.save(user);
        log.info("UserServiceImpl::createUser: User with id:{} was successfully created", savedUser.getId());
        return savedUser;
    }

    @Override
    public User getUserById(String id) {
        return Optional.ofNullable(userRepository.findUserById(id))
                .orElseThrow(() -> new UserDoesNotExistException(id));
    }


    @Override
    public Profile updateUserProfile(String id, ProfileRequest profileRequest) {
        User user = Optional.ofNullable(userRepository.findUserById(id))
                .orElseThrow(() -> new UserDoesNotExistException(id));

        user.setProfile(Profile.builder()
                .withFirstName(profileRequest.firstName())
                .withLastName(profileRequest.lastName())
                .withDateOfBirth(profileRequest.dateOfBirth())
                .withRanking(profileRequest.ranking())
                .withPhoneNumber(profileRequest.phoneNumber())
                .withGender(profileRequest.gender())
                .withPostalCode(profileRequest.postalCode())
                .withSportsOfPreference(profileRequest.sportsOfPreference())
                .build());

        User savedUser = userRepository.save(user);
        Profile updatedProfile = savedUser.getProfile();
        keycloakApiClient.updateUser(savedUser.getKeycloakId(),
                new KeycloakRequest(updatedProfile.getFirstName(), updatedProfile.getLastName())).block();

        log.info("UserServiceImpl::updateUserProfile: User with id:{} was updated", savedUser.getId());
        return savedUser.getProfile();
    }

    @Override
    public Profile patchUserProfile(String id, ProfileRequest profileRequest) {
        User user = Optional.ofNullable(userRepository.findUserById(id))
                .orElseThrow(() -> new UserDoesNotExistException(id));
        Profile profile = Optional.ofNullable(user.getProfile()).orElse(Profile.builder().build());

        profileMapper.updateProfileFromRequest(profileRequest, profile);

        user.setProfile(profile);
        User savedUser = userRepository.save(user);

        if (profileRequest.firstName() != null || profileRequest.lastName() != null) {
            keycloakApiClient.updateUser(
                    savedUser.getKeycloakId(),
                    new KeycloakRequest(profile.getFirstName(), profile.getLastName())
            ).block();
        }
        log.info("UserServiceImpl::patchUserProfile: User with id:{} was updated", savedUser.getId());
        return savedUser.getProfile();
    }

}