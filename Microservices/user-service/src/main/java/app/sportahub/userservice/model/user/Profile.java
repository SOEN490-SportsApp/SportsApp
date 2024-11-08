package app.sportahub.userservice.model.user;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Builder(setterPrefix = "with")
@Document("profile")
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
    private List<String> sportsOfPreference;
    private String ranking;
}
