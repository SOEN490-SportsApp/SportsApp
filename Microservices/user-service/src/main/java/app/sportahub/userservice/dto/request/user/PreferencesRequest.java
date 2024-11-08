package app.sportahub.userservice.dto.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PreferencesRequest(@Nullable
                                 Boolean notifications,

                                 @Nullable
                                 String language) {
}
