package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.Preferences;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PreferencesResponse(Boolean notifications, String language) {

    public static PreferencesResponse from(Preferences preferences) {
        return new PreferencesResponse(preferences.getNotifications(), preferences.getLanguage());
    }
}
