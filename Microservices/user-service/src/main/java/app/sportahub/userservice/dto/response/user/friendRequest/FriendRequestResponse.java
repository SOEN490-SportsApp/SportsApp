package app.sportahub.userservice.dto.response.user.friendRequest;

import java.time.LocalDateTime;

public record FriendRequestResponse(String message, String RequestId,
                                    LocalDateTime createdAt,
                                    LocalDateTime withUpdatedAt,
                                    String profilePictureURL) {
}
