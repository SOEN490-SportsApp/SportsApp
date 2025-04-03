package app.sportahub.userservice.dto.response.user.friend;

import app.sportahub.userservice.dto.response.user.ProfileResponse;

public record ViewFriendResponse(String friendUsername, String friendUserId, String FriendId, ProfileResponse friendProfile) {
}
