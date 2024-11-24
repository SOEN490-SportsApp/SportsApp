package app.sportahub.userservice.dto.response.user;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileResponse(String firstName, String lastName, LocalDate dateOfBirth, String gender,
                              String postalCode, String phoneNumber, List<SportLevelResponse> sportsOfPreference,
                              String ranking) {
}
