package app.sportahub.userservice.dto.response.user;

import app.sportahub.userservice.model.user.Profile;

import java.time.LocalDate;

public record ProfileResponse(String firstName, String lastName, LocalDate dateOfBirth, String phoneNumber,
                              String ranking) {

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getDateOfBirth(),
                profile.getPhoneNumber(),
                profile.getRanking());
    }
}
