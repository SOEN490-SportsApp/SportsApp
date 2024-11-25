package app.sportahub.userservice.response.user;

import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class UserResponseTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

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

        UserResponse userResponse = userMapper.userToUserResponse(user);

        assertNotNull(userResponse);
        assertEquals("test@example.com", userResponse.email());
        assertEquals("testUser", userResponse.username());
        assertNotNull(userResponse.profile());
        assertEquals("John", userResponse.profile().firstName());
        assertEquals("Doe", userResponse.profile().lastName());
        assertEquals(LocalDate.of(1990, 1, 1), userResponse.profile().dateOfBirth());
        assertEquals("1234567890", userResponse.profile().phoneNumber());
        assertEquals("100", userResponse.profile().ranking());
    }

    @Test
    public void fromMethodWithUserAndWithoutProfileShouldReturnUserResponse() {
        User user = User.builder()
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withProfile(null)
                .build();

        UserResponse userResponse = userMapper.userToUserResponse(user);

        assertNotNull(userResponse);
        assertEquals("test@example.com", userResponse.email());
        assertEquals("testUser", userResponse.username());
        assertNull(userResponse.profile(), "Profile should be null when User has no profile");
    }
}
