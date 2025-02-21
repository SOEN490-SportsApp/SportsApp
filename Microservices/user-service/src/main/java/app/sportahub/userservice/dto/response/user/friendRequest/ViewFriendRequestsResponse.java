package app.sportahub.userservice.dto.response.user.friendRequest;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;

import java.time.LocalDateTime;

public record ViewFriendRequestsResponse(String friendRequestUsername,
                                         String friendRequestUserId,
                                         FriendRequestStatusEnum status,
                                         String RequestId,
                                         LocalDateTime createdAt,
                                         String profilePictureURL) {
}
