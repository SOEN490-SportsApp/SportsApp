package app.sportahub.userservice.dto.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;

import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileRequest(@Nullable
                             String firstName,

                             @Nullable
                             String lastName,

                             @Nullable
                             LocalDate dateOfBirth,

                             @Nullable
                             String gender,

                             @Nullable
                             String postalCode,

                             @Nullable
                             String phoneNumber,

                             @Nullable
                             List<SportLevelRequest> sportsOfPreference,

                             @Nullable
                             String ranking) {
}
