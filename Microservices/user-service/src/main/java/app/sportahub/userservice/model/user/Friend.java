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

    @NotBlank(message = "Username of friend must be provided.")
    private String username;

    @NotBlank(message = "Friend request status must be provided.")
    private Enum<FriendRequestStatusEnum> friendRequestStatus;
}