package app.sportahub.userservice.response.user;

import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

public class UserResponseTest {

    @Test
    public void fromMethodWithUserAndProfileShouldReturnUserResponse() {
        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withDateOfBirth(LocalDate.of(1990, 1, 1))
                .withPhoneNumber("1234567890")
                .withRanking("100")
                .build();

        User user = User.builder()
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withProfile(profile)
                .build();

        UserResponse userResponse = UserResponse.from(user);

        Assertions.assertNotNull(userResponse);
        Assertions.assertEquals("test@example.com", userResponse.email());
        Assertions.assertEquals("testUser", userResponse.username());
        Assertions.assertNotNull(userResponse.profile());
        Assertions.assertEquals("John", userResponse.profile().firstName());
        Assertions.assertEquals("Doe", userResponse.profile().lastName());
        Assertions.assertEquals(LocalDate.of(1990, 1, 1), userResponse.profile().dateOfBirth());
        Assertions.assertEquals("1234567890", userResponse.profile().phoneNumber());
        Assertions.assertEquals("100", userResponse.profile().ranking());
    }

    @Test
    public void fromMethodWithUserAndWithoutProfileShouldReturnUserResponse() {
        User user = User.builder()
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withProfile(null)
                .build();

        UserResponse userResponse = UserResponse.from(user);

        Assertions.assertNotNull(userResponse);
        Assertions.assertEquals("test@example.com", userResponse.email());
        Assertions.assertEquals("testUser", userResponse.username());
        Assertions.assertNull(userResponse.profile(), "Profile should be null when User has no profile");
    }

    @Test
    public void fromMethodWithNullUserShouldThrowNullPointerException() {
        Assertions.assertThrows(NullPointerException.class, () -> UserResponse.from(null),
                "Should throw NullPointerException when user is null");
    }
}
