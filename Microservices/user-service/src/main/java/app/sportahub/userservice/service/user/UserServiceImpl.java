package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.friend.FriendRequestRequest;
import app.sportahub.userservice.dto.request.user.friend.UpdateFriendRequestRequest;
import app.sportahub.userservice.dto.response.user.UserProfileResponse;
import app.sportahub.userservice.dto.response.user.friend.ViewFriendResponse;
import app.sportahub.userservice.dto.response.user.friendRequest.FriendRequestResponse;
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
import app.sportahub.userservice.dto.response.user.friendRequest.UpdateFriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friendRequest.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.enums.user.UpdateFriendRequestActionEnum;
import app.sportahub.userservice.exception.user.friend.*;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.*;
import app.sportahub.userservice.exception.user.badge.BadgeNotFoundException;
import app.sportahub.userservice.exception.user.badge.UserAlreadyAssignedBadgeByThisGiverException;
import app.sportahub.userservice.exception.user.friend.InvalidFriendRequestStatusTypeException;
import app.sportahub.userservice.exception.user.friend.UserSentFriendRequestToSelfException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.exception.user.friendRequest.FriendNotFoundInFriendRequestListException;
import app.sportahub.userservice.exception.user.friendRequest.FriendRequestDoesNotExistException;
import app.sportahub.userservice.exception.user.friendRequest.GivenFriendUserIdDoesNotMatchFriendRequestFoundByIdException;
import app.sportahub.userservice.exception.user.friendRequest.UserAlreadyInFriendRequestListException;
import app.sportahub.userservice.mapper.user.FriendMapper;
import app.sportahub.userservice.exception.user.friend.*;
import app.sportahub.userservice.exception.user.keycloak.KeycloakCommunicationException;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.mapper.user.PublicProfileMapper;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.*;
import app.sportahub.userservice.repository.BadgeRepository;
import app.sportahub.userservice.repository.FriendRepository;
import app.sportahub.userservice.repository.FriendRequestRepository;
import app.sportahub.userservice.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    private final FriendMapper friendMapper;
    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
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

        for (FriendRequest friendRequest : userSender.getFriendRequestList()) {
            if (friendRequest.getUserId().equals(userReceiver.getId()))
                throw new UserAlreadyInFriendRequestListException(userReceiver.getUsername(),
                        friendRequest.getFriendRequestStatus());
        }

        FriendRequest newSenderFriendRequest = FriendRequest.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUserId(userReceiver.getId())
                .withFriendRequestStatus(FriendRequestStatusEnum.SENT)
                .build();
        FriendRequest savedSenderFriendRequest = friendRequestRepository.save(newSenderFriendRequest);

        FriendRequest newReceiverFriendRequest = FriendRequest.builder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUserId(userSender.getId())
                .withFriendRequestStatus(FriendRequestStatusEnum.RECEIVED)
                .build();
        friendRequestRepository.save(newReceiverFriendRequest);

        userSender.getFriendRequestList().add(newSenderFriendRequest);
        userReceiver.getFriendRequestList().add(newReceiverFriendRequest);

        User savedSenderUser = userRepository.save(userSender);
        log.info("UserServiceImpl::sendFriendRequest: User with id: {} sent a new friend request", savedSenderUser.getId());

        User savedReceiverUser = userRepository.save(userReceiver);
        log.info("UserServiceImpl::sendFriendRequest: User with id: {} received a new friend request",
                savedReceiverUser.getId());

        return new FriendRequestResponse("Friend request sent successfully.", savedSenderFriendRequest.getId());
    }

    @Override
    public UpdateFriendRequestResponse updateFriendRequest(String userId, String requestId,
                                                           UpdateFriendRequestRequest updateFriendRequestRequest) {

        // Find the user that is trying to update their received friend request
        User user = userRepository.findUserById(userId).orElseThrow(() -> new UserDoesNotExistException(userId))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        // Find the user who originally sent the request
        User friendUser = userRepository.findUserById(updateFriendRequestRequest.friendRequestUserId())
                .orElseThrow(() -> new UserDoesNotExistException(updateFriendRequestRequest.friendRequestUserId()))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        // find the friend request, based on the given friend request id
        FriendRequest friendRequest = friendRequestRepository.findFriendRequestById(requestId).orElseThrow(() ->
                        new FriendRequestDoesNotExistException(requestId))
                .toBuilder()
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        // Check to make sure the info sent with the request and the info found matches up
        if (!friendRequest.getUserId().equals(friendUser.getId())) {
            throw new GivenFriendUserIdDoesNotMatchFriendRequestFoundByIdException(friendUser.getId(), requestId);
        }

        // The action the user wants to perform on the friend request in question
        // ACCEPT: accept the friend request, add as a friend in both friend lists, remove from both friendRequest lists
        // DECLINE: Delete the friend request, removing it from both friendRequest lists
        UpdateFriendRequestActionEnum action = updateFriendRequestRequest.action();

        // Booleans flags to see if the friend request was found in both users' friend request lists
        // If not found in either list, an error is thrown and no modifications are saved
        AtomicBoolean isFriendFound1 = new AtomicBoolean(false);
        AtomicBoolean isFriendFound2 = new AtomicBoolean(false);

        List<FriendRequest> userFriendRequestList = user.getFriendRequestList();
        List<Friend> userFriendList = user.getFriendList();

        List<FriendRequest> friendUserFriendRequestList = friendUser.getFriendRequestList();
        List<Friend> friendUserFriendList = friendUser.getFriendList();

        // Iterate through the user's friendRequest list to find the relevant friendRequest based on given parameters
        userFriendRequestList.stream().filter(e -> e.getUserId().equals(friendRequest.getUserId()))
                .findAny().ifPresent(e -> {

            // Make sure the user isn't trying to accept a friend request that's not marked as RECEIVED
            if (!e.getFriendRequestStatus().equals(FriendRequestStatusEnum.RECEIVED) &&
                    action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                throw new TryingToAcceptInvalidFriendRequestException(user.getId(),
                        friendUser.getId(), e.getFriendRequestStatus());
            }
            isFriendFound1.set(true);

            // If the action is ACCEPT, then we change the status of the friend request and move it to the friend list
            // If the action is DECLINE, we simply remove the friend request from the friend list
            if (action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                userFriendRequestList.remove(e);
                e.setFriendRequestStatus(FriendRequestStatusEnum.ACCEPTED);
                Friend friend1 = friendMapper.friendRequestToFriend(e);
                userFriendList.add(friend1);
                friendRepository.save(friend1);
                friendRequestRepository.deleteById(e.getId());
            } else if (action.equals(UpdateFriendRequestActionEnum.DECLINE)) {
                userFriendRequestList.remove(e);
                friendRequestRepository.deleteById(e.getId());
            }

            // If the operation was successful for the user, we repeat the process for the user who original sent the friend request
            friendUserFriendRequestList.stream().filter(el -> el.getUserId().equals(user.getId())).findAny().ifPresent(el -> {
                isFriendFound2.set(true);
                if (action.equals(UpdateFriendRequestActionEnum.ACCEPT)) {
                    friendUserFriendRequestList.remove(el);
                    el.setFriendRequestStatus(FriendRequestStatusEnum.ACCEPTED);
                    Friend friend2 = friendMapper.friendRequestToFriend(el);
                    friendUserFriendList.add(friend2);
                    friendRepository.save(friend2);
                    friendRequestRepository.deleteById(el.getId());
                } else if (action.equals(UpdateFriendRequestActionEnum.DECLINE)) {
                    friendUserFriendRequestList.remove(el);
                    friendRequestRepository.deleteById(el.getId());
                }
            });
        });

        // These errors make sure we don't save any changes if the transaction was invalid
        if (!isFriendFound1.get())
            throw new FriendNotFoundInFriendRequestListException(user.getId(), friendUser.getId());
        if (!isFriendFound2.get())
            throw new FriendNotFoundInFriendRequestListException(friendUser.getId(), user.getId());

        // Then we save the modifications to the database
        user.setFriendList(userFriendList);
        user.setFriendRequestList(userFriendRequestList);
        userRepository.save(user);

        friendUser.setFriendList(friendUserFriendList);
        friendUser.setFriendRequestList(friendUserFriendRequestList);
        userRepository.save(friendUser);

        String responseMessage;

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
     * This method returns the details of the user's friendRequests based on the given type(s).
     *
     * @param userId The user id of the user whose friend requests you want to retrieve
     * @param typeList The types of friend request you want to retrieve: RECEIVED and/or SENT.
     * @return a list of {@link ViewFriendRequestsResponse} containing the details of the friend requests
     * @throws UserDoesNotExistException if the given user id doesn't correspond to a user in the database
     */
    @Override
    public List<ViewFriendRequestsResponse> getFriendRequests(String userId, List<FriendRequestStatusEnum> typeList) {
        if (typeList.contains(FriendRequestStatusEnum.ACCEPTED)) {
            throw new InvalidFriendRequestStatusTypeException(FriendRequestStatusEnum.ACCEPTED);
        }

        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        List<FriendRequest> friendRequestList = user.getFriendRequestList();

        return friendRequestList.stream()
                .filter(s -> typeList.contains(s.getFriendRequestStatus()) )
                .map(friendRequest -> new ViewFriendRequestsResponse(
                        getUserById(friendRequest.getUserId()).username(),friendRequest.getUserId(),
                        friendRequest.getFriendRequestStatus(), friendRequest.getId())).toList();
    }

    /**
     * This method returns the details of all the user's friends in their friend list
     *
     * @param userId The user id of the user whose friends you want to retrieve
     * @return a list of {@link ViewFriendResponse} containing the details of each friend found
     * @throws UserDoesNotExistException if the given user id doesn't correspond to a user in the database
     */
    @Override
    public List<ViewFriendResponse> getFriends(String userId) {

        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        List<Friend> friendList = user.getFriendList();

        return friendList.stream()
                .map(friend -> new ViewFriendResponse(getUserById(friend.getUserId()).username(), friend.getUserId(),
                        friend.getId())).toList();
    }

    @Transactional
    @Override
    public void deleteFriend(String userId, String friendId) {
        User requester = userRepository.findUserById(userId)
                .orElseThrow(() -> new UserDoesNotExistException(userId));
        List<Friend> requesterFriendList = requester.getFriendList();

        Friend requesterFriend = requesterFriendList.stream().filter(f -> f.getId().equals(friendId))
                .findFirst().orElseThrow(() -> new FriendNotFoundInFriendListException(userId,friendId));

        User friend = userRepository.findUserById(requesterFriend.getUserId())
                        .orElseThrow(() -> new UserDoesNotExistException(requesterFriend.getUserId()));
        List<Friend> friendFriendList = friend.getFriendList();

        Friend friendFriend = friendFriendList.stream().filter(friendF -> friendF.getUserId().equals(requester.getId()))
                        .findFirst().orElseThrow(() -> new FriendNotFoundInFriendListException(friend.getId(), requester.getId()));

        requesterFriendList.remove(requesterFriend);
        friendFriendList.remove(friendFriend);

        friendRepository.deleteById(requesterFriend.getId());
        friendRepository.deleteById(friendFriend.getId());

        requester.setFriendList(requesterFriendList);
        friend.setFriendList(friendFriendList);

        userRepository.save(requester);
        userRepository.save(friend);

        log.info("deleteFriend: Friend with id: {} was successfully deleted", requesterFriend.getId());
        log.info("deleteFriend: Friend with id: {} was successfully deleted", friendFriend.getId());

    }

    @Override
    public Page<UserProfileResponse> searchUsers(String firstName, String lastName, List<String> sport, List<String> rankings, String gender, String age, Pageable pageable) {
        if (firstName == null & lastName == null & sport == null && rankings == null && gender == null && age == null) {
            throw new NoSearchCriteriaProvidedException();
        }
        log.info("UserServiceImpl::searchUsers: User created a search query");
        Page<User> users = userRepository.searchUsers(firstName, lastName, sport, rankings, gender, age, pageable);

        List<UserProfileResponse> userProfileResponses = users.stream()
                .map(user -> new UserProfileResponse(user.getId(), profileMapper.profileToProfileResponse(user.getProfile())))
                .collect(Collectors.toList());
        return new PageImpl<>(userProfileResponses, users.getPageable(), users.getTotalElements());
    }
}