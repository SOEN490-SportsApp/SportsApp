package app.sportahub.userservice.dto.response.user.friendRequest;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;

public record ViewFriendRequestsResponse(String friendRequestUsername, String friendRequestUserId, FriendRequestStatusEnum status, String RequestId) {
}
