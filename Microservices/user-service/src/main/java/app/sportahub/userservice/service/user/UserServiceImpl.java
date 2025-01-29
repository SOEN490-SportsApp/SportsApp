package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.request.user.friend.FriendRequestRequest;
import app.sportahub.userservice.dto.request.user.friend.UpdateFriendRequestRequest;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.PublicProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import app.sportahub.userservice.dto.response.user.friend.FriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friend.UpdateFriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friend.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.enums.user.UpdateFriendRequestActionEnum;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.*;
import app.sportahub.userservice.exception.user.badge.BadgeNotFoundException;
import app.sportahub.userservice.exception.user.badge.UserAlreadyAssignedBadgeByThisGiverException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.exception.user.friend.*;
import app.sportahub.userservice.exception.user.keycloak.KeycloakCommunicationException;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.mapper.user.PublicProfileMapper;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.*;
import app.sportahub.userservice.repository.BadgeRepository;
import app.sportahub.userservice.repository.FriendRepository;
import app.sportahub.userservice.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final KeycloakApiClient keycloakApiClient;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;
    private final FriendRepository friendRepository;
    private final PublicProfileMapper publicProfileMapper;

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

        User user = userMapper.userRequestToUser(userRequest)
                .toBuilder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now())).build();

        User savedUser = userRepository.save(user);
        log.info("UserServiceImpl::createUser: User with id:{} was successfully created", savedUser.getId());
        return userMapper.userToUserResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        return userMapper.userToUserResponse(userRepository.findUserById(id)
                .orElseThrow(() -> new UserDoesNotExistException(id)));
    }

    @Override
    public PublicProfileResponse getUserPublicProfile(String id) {
        User user = userRepository.findUserById(id).orElseThrow(() -> new UserDoesNotExistException(id));
        return publicProfileMapper.userToPublicProfileResponse(user);
    }

    @Override
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
    }

    @Override
    public ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest) {
        User user = userRepository.findUserById(id).orElseThrow(() -> new UserDoesNotExistException(id));
        Profile profile = Optional.ofNullable(user.getProfile()).orElse(Profile.builder().build());

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

    @Override
    public UserResponse assignBadge(String userId, String badgeId, String giverId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        Profile profile = Optional.ofNullable(user.getProfile()).orElse(Profile.builder().build());

        if (profile.getBadges().stream().anyMatch(b -> b.getBadgeId().equals(badgeId) && b.getGiverId().equals(giverId))) {
            throw new UserAlreadyAssignedBadgeByThisGiverException();
        }

        UserBadge newBadge = UserBadge.builder()
                .badgeId(badgeId)
                .giverId(giverId)
                .build();
        profile.getBadges().add(newBadge);
        return userMapper.userToUserResponse(userRepository.save(user));
    }

    @Override
    public List<BadgeWithCountResponse> getUserBadges(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        Profile profile = Optional.ofNullable(user.getProfile()).orElse(Profile.builder().build());

        return profile.getBadges().stream()
                .collect(Collectors.groupingBy(
                        UserBadge::getBadgeId,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)))
                .entrySet().stream()
                .map(entry -> {
                    Badge badge = badgeRepository.findById(entry.getKey()).orElseThrow(() ->
                            new BadgeNotFoundException(entry.getKey()));
                    return new BadgeWithCountResponse(
                            new BadgeResponse(badge.getName(), badge.getDescription(), badge.getIconUrl()),
                            entry.getValue());
                })
                .toList();
    }

    /**
     * Deletes a user by their unique identifier.
     *
     * @param userId the unique identifier of the user to delete
     * @throws UserDoesNotExistException      if the user with the specified ID does not exist
     * @throws KeycloakCommunicationException if the user cannot be deleted from Keycloak
     */
    @Override
    @Transactional
    public void deleteUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));

        keycloakApiClient.deleteUser(user.getKeycloakId())
                .block();
        userRepository.deleteById(userId);
        log.info("deleteUser: User with id: {} was successfully deleted", userId);
    }

    @Override
    public FriendRequestResponse sendFriendRequest(String userId, FriendRequestRequest friendRequestRequest) {
        User userSender = userRepository.findUserById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        User userReceiver = userRepository.findUserById(friendRequestRequest.receiverUserId())
                .orElseThrow(() -> new UserDoesNotExistException(friendRequestRequest.receiverUserId()));

        if (userSender.equals(userReceiver)) {
            throw new UserSentFriendRequestToSelfException();
        }

        for (Friend friend : userSender.getFriendList()) {
            if (friend.getUserId().equals(userReceiver.getId()))
                throw new UserAlreadyInFriendListException(userReceiver.getUsername(), friend.getFriendRequestStatus());
        }

        Friend newSenderFriend = Friend.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUserId(userReceiver.getId())
                .withFriendRequestStatus(FriendRequestStatusEnum.SENT)
                .build();
        Friend savedSenderFriend = friendRepository.save(newSenderFriend);

        Friend newReceiverFriend = Friend.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUserId(userSender.getId())
                .withFriendRequestStatus(FriendRequestStatusEnum.RECEIVED)
                .build();
        friendRepository.save(newReceiverFriend);

        userSender.getFriendList().add(newSenderFriend);
        userReceiver.getFriendList().add(newReceiverFriend);

        User savedSenderUser = userRepository.save(userSender);
        log.info("UserServiceImpl::sendFriendRequest: User with id: {} sent a new friend request", savedSenderUser.getId());

        User savedReceiverUser = userRepository.save(userReceiver);
        log.info("UserServiceImpl::sendFriendRequest: User with id: {} received a new friend request",
                savedReceiverUser.getId());

        return new FriendRequestResponse("Friend request sent successfully.", savedSenderFriend.getId());
    }

    @Override
    public UpdateFriendRequestResponse updateFriendRequest(String userId, String requestId,
                                                           UpdateFriendRequestRequest updateFriendRequestRequest) {
        User user = userRepository.findUserById(userId).orElseThrow(() -> new UserDoesNotExistException(userId))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        User friendUser = userRepository.findUserById(updateFriendRequestRequest.friendUserId())
                .orElseThrow(() -> new UserDoesNotExistException(updateFriendRequestRequest.friendUserId()))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        Friend friend = friendRepository.findFriendById(requestId).orElseThrow(() -> new FriendDoesNotExistException(requestId))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        if (!friend.getUserId().equals(friendUser.getId())) {
            throw new GivenFriendUserIdDoesNotMatchFriendFoundByIdException(friendUser.getId(), requestId);
        }

        UpdateFriendRequestActionEnum action = updateFriendRequestRequest.action();
        AtomicBoolean isFriendFound1 = new AtomicBoolean(false);
        AtomicBoolean isFriendFound2 = new AtomicBoolean(false);
        List<Friend> userFriendList = user.getFriendList();
        List<Friend> friendUserFriendList = friendUser.getFriendList();

        userFriendList.stream().filter(e -> e.getUserId().equals(friend.getUserId())).findAny().ifPresent(e -> {
            if (!e.getFriendRequestStatus().equals(FriendRequestStatusEnum.RECEIVED) &&
                    action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                throw new TryingToAcceptInvalidFriendRequestException(user.getId(),
                        friendUser.getId(), e.getFriendRequestStatus());
            }
            isFriendFound1.set(true);

            if (action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                e.setFriendRequestStatus(FriendRequestStatusEnum.ACCEPTED);
            } else if (action.equals(UpdateFriendRequestActionEnum.DECLINE)) {
                userFriendList.remove(e);
            }

            friendUserFriendList.stream().filter(el -> el.getUserId().equals(user.getId())).findAny().ifPresent(el -> {
                isFriendFound2.set(true);
                if (action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                    el.setFriendRequestStatus(FriendRequestStatusEnum.ACCEPTED);
                } else if (action.equals(UpdateFriendRequestActionEnum.DECLINE)) {
                    friendUserFriendList.remove(el);
                }
            });
        });

        if (!isFriendFound1.get())
            throw new FriendNotFoundInFriendListException(user.getId(), friendUser.getId());
        if (!isFriendFound2.get())
            throw new FriendNotFoundInFriendListException(friendUser.getId(), user.getId());

        user.setFriendList(userFriendList);
        userRepository.save(user);
        friendUser.setFriendList(friendUserFriendList);
        userRepository.save(friendUser);
        String responseMessage;
        friendRepository.save(friend);

        if (action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
            log.info("UserServiceImpl::updateFriendRequest: User with id:{} accepted the friend request of user with id:{}",
                    user.getId(), friendUser.getId());

            responseMessage = "User with id: " + user.getId()
                    + " accepted the friend request of user with id: " + friendUser.getId() + " successfully";

        } else if (action.equals(UpdateFriendRequestActionEnum.DECLINE)) {
            log.info("UserServiceImpl::updateFriendRequest: User with id:{} declined the friend request of user with id:{}",
                    user.getId(), friendUser.getId());

            responseMessage = "User with id: " + user.getId()
                    + " declined the friend request of user with id: " + friendUser.getId() + " successfully";
        } else {
            throw new UnexpectedUpdateFriendRequestActionException(action);
        }
        return new UpdateFriendRequestResponse(responseMessage);
    }

    /**
     * This method returns the usernames of all the users who sent a friend request to the user with the given user id.
     *
     * @param userId The user id of the user whose friends requests you want to retrieve
     * @return a list of {@link ViewFriendRequestsResponse} containing the usernames of the users who sent a friend request
     * @throws UserDoesNotExistException if the given user id doesn't correspond to a user
     */
    @Override
    public List<ViewFriendRequestsResponse> getFriendRequests(String userId, List<FriendRequestStatusEnum> typeList) {
        if (typeList.contains(FriendRequestStatusEnum.ACCEPTED)) {
            throw new InvalidFriendRequestStatusTypeException(FriendRequestStatusEnum.ACCEPTED);
        }

        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        List<Friend> friends = user.getFriendList();

        return friends.stream()
                .filter(s -> typeList.contains(s.getFriendRequestStatus()))
                .map(friend -> new ViewFriendRequestsResponse(
                        getUserById(friend.getUserId()).username(), friend.getUserId(), friend.getFriendRequestStatus(), friend.getId())).toList();
    }

    @Override
    public Page<ProfileResponse> searchUsers(String firstName, String lastName, List<String> sport, List<String> rankings, String gender, String age, Pageable pageable) {
        if (firstName == null & lastName == null & sport == null && rankings == null && gender == null && age == null) {
            throw new NoSearchCriteriaProvidedException();
        }
        log.info("UserServiceImpl::searchUsers: User created a search query");
        Page<User> users = userRepository.searchUsers(firstName, lastName, sport, rankings, gender, age, pageable);

        return users.map(user -> profileMapper.profileToProfileResponse(user.getProfile()));
    }
}
