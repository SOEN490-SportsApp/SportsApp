package app.sportahub.userservice.service.user;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import org.springframework.stereotype.Service;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.model.user.Preferences;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
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
        Optional<User> optionalUserById = Optional.ofNullable(userRepository.findUserById(id));
        if (optionalUserById.isEmpty()) {
            throw new UserDoesNotExistException(id);
        }
        User user = optionalUserById.get();
        Profile previousProfile = user.getProfile();
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
        if(
                previousProfile == null ||
                !Objects.equals(updatedProfile.getFirstName(), previousProfile.getFirstName()) ||
                !Objects.equals(updatedProfile.getLastName(), previousProfile.getLastName())
        ) {
            keycloakApiClient.updateUser(savedUser.getKeycloakId(), new KeycloakRequest(
                    updatedProfile.getFirstName(),
                    updatedProfile.getLastName()
            ));
        }
        log.info("UserServiceImpl::updateUserProfile: User with id:{} was updated", savedUser.getId());
        return updatedProfile;
    }

    @Override
    public Profile patchUserProfile(String id, ProfileRequest profileRequest) {
        Optional<User> optionalUserById = Optional.ofNullable(userRepository.findUserById(id));
        if (optionalUserById.isEmpty()) {
            throw new UserDoesNotExistException(id);
        }
        User user = optionalUserById.get();
        Profile currentProfile = user.getProfile();
        Profile updatedProfile = Profile.builder()
                .withFirstName(
                        profileRequest.firstName() != null ? profileRequest.firstName() : currentProfile.getFirstName())
                .withLastName(
                        profileRequest.lastName() != null ? profileRequest.lastName() : currentProfile.getLastName())
                .withDateOfBirth(profileRequest.dateOfBirth() != null ? profileRequest.dateOfBirth()
                        : currentProfile.getDateOfBirth())
                .withRanking(profileRequest.ranking() != null ? profileRequest.ranking() : currentProfile.getRanking())
                .withPhoneNumber(profileRequest.phoneNumber() != null ? profileRequest.phoneNumber()
                        : currentProfile.getPhoneNumber())
                .withGender(profileRequest.gender() != null ? profileRequest.gender() : currentProfile.getGender())
                .withPostalCode(profileRequest.postalCode() != null ? profileRequest.postalCode()
                        : currentProfile.getPostalCode())
                .withSportsOfPreference(
                        profileRequest.sportsOfPreference() != null ? profileRequest.sportsOfPreference()
                                : currentProfile.getSportsOfPreference())
                .build();

        user.setProfile(updatedProfile);
        User savedUser = userRepository.save(user);

        if(profileRequest.firstName() != null || profileRequest.lastName() != null) {
            keycloakApiClient.updateUser(savedUser.getKeycloakId(), new KeycloakRequest(
                    updatedProfile.getFirstName(),
                    updatedProfile.getLastName()
            ));
        }
        log.info("UserServiceImpl::patchUserProfile: User with id:{} was updated", savedUser.getId());
        return savedUser.getProfile();
    }

}