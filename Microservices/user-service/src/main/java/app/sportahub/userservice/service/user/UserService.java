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

import java.util.List;

public interface UserService {

    UserResponse getUserById(String id);

    UserResponse createUser(UserRequest userRequest);

    ProfileResponse updateUserProfile(String id, ProfileRequest profileRequest);

    ProfileResponse patchUserProfile(String id, ProfileRequest profileRequest);

    UserResponse assignBadge(String userId, String badgeId, String giverId);

    List<BadgeWithCountResponse> getUserBadges(String userId);

    FriendRequestResponse sendFriendRequest(String userId, FriendRequestRequest friendRequestRequest);

    UpdateFriendRequestResponse updateFriendRequest(String userId, String requestId,
                                                    UpdateFriendRequestRequest updateFriendRequestRequest);

    List<ViewFriendRequestsResponse> getFriendRequests(String userId, List<FriendRequestStatusEnum> typeList);
}
