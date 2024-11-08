package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.Profile;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileResponse(String firstName, String lastName, LocalDate dateOfBirth, String gender,
                              String postalCode, String phoneNumber, List<String> sportsOfPreference,
                              String ranking) {

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getDateOfBirth(),
                profile.getGender(),
                profile.getPostalCode(),
                profile.getPhoneNumber(),
                profile.getSportsOfPreference(),
                profile.getRanking());
    }
}
