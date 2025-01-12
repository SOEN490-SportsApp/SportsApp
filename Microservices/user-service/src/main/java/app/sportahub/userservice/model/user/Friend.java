package app.sportahub.userservice.model.user;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Friend {

    @NotBlank(message = "User id of friend must be provided.")
    private String userId;

    @NotBlank(message = "Friend request status must be provided.")
    private FriendRequestStatusEnum friendRequestStatus;
}