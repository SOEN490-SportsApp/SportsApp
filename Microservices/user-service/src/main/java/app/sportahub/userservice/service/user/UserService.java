package app.sportahub.userservice.service.user;

import app.sportahub.userservice.dto.request.user.friend.FriendRequestRequest;
import app.sportahub.userservice.dto.request.user.friend.UpdateFriendRequestRequest;
import app.sportahub.userservice.dto.response.user.friend.FriendRequestResponse;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import app.sportahub.userservice.dto.response.user.friend.UpdateFriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friend.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    UserResponse getUserById(String id);

    UserResponse createUser(UserRequest userRequest);

    ProfileResponse updateUserProfile(String id, ProfileRequest profileRequest);

    ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest);

    UserResponse assignBadge(String userId, String badgeId, String giverId);

    List<BadgeWithCountResponse> getUserBadges(String userId);

    void deleteUserById(String id);

    FriendRequestResponse sendFriendRequest(String userId, FriendRequestRequest friendRequestRequest);

    List<ViewFriendRequestsResponse> getFriendRequests(String userId, List<FriendRequestStatusEnum> typeList);

    UpdateFriendRequestResponse updateFriendRequest(String userId, String requestId,
                                                    UpdateFriendRequestRequest updateFriendRequestRequest);

    Page<ProfileResponse> searchUsers(String firstName, String lastName, List<String> sport, List<String> rankings, String gender, String age, Pageable pageable);
}
