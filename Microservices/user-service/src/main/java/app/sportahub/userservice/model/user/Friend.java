package app.sportahub.userservice.model.user;

import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@SuperBuilder(toBuilder = true, setterPrefix = "with")
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Document("friend")
@Data
public class Friend extends BaseEntity {

    @NotBlank(message = "User id of friend must be provided.")
    private String userId;

    @NotBlank(message = "Friend request status must be provided.")
    private FriendRequestStatusEnum friendRequestStatus;
}