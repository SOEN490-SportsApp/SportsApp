package app.sportahub.userservice.model.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Preferences {

    @Builder.Default
    Boolean notifications = true;

    @NotBlank(message = "Language is required")
    @Builder.Default
    String language = "english";
}
