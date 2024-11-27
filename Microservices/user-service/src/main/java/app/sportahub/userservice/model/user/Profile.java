package app.sportahub.userservice.model.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Profile {

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String postalCode;
    private String phoneNumber;
    private String ranking;

    @Builder.Default
    private List<SportLevel> sportsOfPreference = new ArrayList<>();

    @DBRef
    @Builder.Default
    private List<UserBadge> badges = new ArrayList<>();
}
