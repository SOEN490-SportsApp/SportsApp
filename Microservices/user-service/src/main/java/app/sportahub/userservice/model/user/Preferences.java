package app.sportahub.userservice.model.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Preferences {

    @Builder.Default
    boolean notifications = true;

    @NotBlank(message = "Language is required")
    @NotNull(message = "Language is required")
    @Builder.Default
    String language = "english";
}
