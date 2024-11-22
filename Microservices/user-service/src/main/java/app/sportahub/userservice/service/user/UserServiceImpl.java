package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.exception.user.badge.BadgeNotFoundException;
import app.sportahub.userservice.exception.user.badge.UserAlreadyAssignedBadgeByThisGiverException;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakApiClient keycloakApiClient;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        userRepository.findUserByEmail(userRequest.email())
                .ifPresent(user -> {
                    throw new UserEmailAlreadyExistsException(userRequest.email());
                });
        userRepository.findUserByUsername(userRequest.username())
                .ifPresent(user -> {
                    throw new UsernameAlreadyExistsException(userRequest.username());
                });
    public UserResponse createUser(UserRequest userRequest) {
        userRepository.findUserByEmail(userRequest.email())
                .ifPresent(user -> {
                    throw new UserEmailAlreadyExistsException(userRequest.email());
                });
        userRepository.findUserByUsername(userRequest.username())
                .ifPresent(user -> {
                    throw new UsernameAlreadyExistsException(userRequest.username());
                });

        User user = userMapper.userRequestToUser(userRequest)
                .toBuilder()
        User user = userMapper.userRequestToUser(userRequest)
                .toBuilder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now())).build();
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now())).build();

        User savedUser = userRepository.save(user);
        log.info("UserServiceImpl::createUser: User with id:{} was successfully created", savedUser.getId());
        return userMapper.userToUserResponse(savedUser);
        return userMapper.userToUserResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        return userMapper.userToUserResponse(userRepository.findUserById(id)
                .orElseThrow(() -> new UserDoesNotExistException(id)));
    public UserResponse getUserById(String id) {
        return userMapper.userToUserResponse(userRepository.findUserById(id)
                .orElseThrow(() -> new UserDoesNotExistException(id)));
    }

    @Override
    public ProfileResponse updateUserProfile(String id, ProfileRequest profileRequest) {
        User user = userRepository.findUserById(id).orElseThrow(() -> new UserDoesNotExistException(id))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        user.setProfile(profileMapper.profileRequestToProfile(profileRequest));
    public ProfileResponse updateUserProfile(String id, ProfileRequest profileRequest) {
        User user = userRepository.findUserById(id).orElseThrow(() -> new UserDoesNotExistException(id))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        user.setProfile(profileMapper.profileRequestToProfile(profileRequest));

        User savedUser = userRepository.save(user);
        Profile updatedProfile = savedUser.getProfile();
        keycloakApiClient.updateUser(savedUser.getKeycloakId(),
                new KeycloakRequest(updatedProfile.getFirstName(), updatedProfile.getLastName())).block();

        log.info("UserServiceImpl::updateUserProfile: User with id:{} was updated", savedUser.getId());
        return profileMapper.profileToProfileResponse(savedUser.getProfile());
        return profileMapper.profileToProfileResponse(savedUser.getProfile());
    }

    @Override
    public ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest) {
    public ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest) {
        User user = userRepository.findUserById(id).orElseThrow(() -> new UserDoesNotExistException(id));
        Profile profile = Optional.ofNullable(user.getProfile()).orElse(Profile.builder().build());

        profileMapper.patchProfileFromRequest(profileRequest, profile);
        profileMapper.patchProfileFromRequest(profileRequest, profile);

        user.setProfile(profile);
        User savedUser = userRepository.save(user);

        if (profileRequest.firstName() != null || profileRequest.lastName() != null) {
            keycloakApiClient.updateUser(
                    savedUser.getKeycloakId(),
                    new KeycloakRequest(profile.getFirstName(), profile.getLastName())
            ).block();
        }
        log.info("UserServiceImpl::patchUserProfile: User with id:{} was updated", savedUser.getId());
        return profileMapper.profileToProfileResponse(savedUser.getProfile());
    }
}