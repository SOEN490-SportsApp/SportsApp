package app.sportahub.userservice.dto.response.user.friend;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;

public record ViewFriendRequestsResponse(String friendUsername, String friendUserId, FriendRequestStatusEnum status, String id) {
}
