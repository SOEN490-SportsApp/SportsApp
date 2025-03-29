package app.sportahub.messagingservice.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Member {
    @NotNull
    private String userId;

    @NotNull
    private String username;

    private String userImage;
}
