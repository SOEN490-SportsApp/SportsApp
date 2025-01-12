package app.sportahub.userservice.dto.request.user.friend;

import app.sportahub.userservice.enums.user.UpdateFriendRequestActionEnum;

public record UpdateFriendRequestRequest(String friendUserId, UpdateFriendRequestActionEnum action) {
}
