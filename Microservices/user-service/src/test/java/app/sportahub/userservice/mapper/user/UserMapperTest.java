package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    public void setup() {
        userMapper = Mappers.getMapper(UserMapper.class);
    }

    @Test
    public void shouldMapUserRequestToUser() {
        UserRequest request = new UserRequest("keycloak123", "john.doe@example.com", "john_doe", "password123", null, null, null);
        User user = userMapper.userRequestToUser(request);

        assertNotNull(user);
        assertEquals("john.doe@example.com", user.getEmail());
        assertEquals("john_doe", user.getUsername());
        assertEquals("keycloak123", user.getKeycloakId());
    }

    @Test
    public void shouldMapUserToUserResponse() {
        User user = User.builder()
                .withId("1")
                .withKeycloakId("keycloak123")
                .withEmail("john.doe@example.com")
                .withUsername("john_doe")
                .build();

        UserResponse response = userMapper.userToUserResponse(user);
        assertNotNull(response);
        assertEquals("1", response.id());
        assertEquals("john.doe@example.com", response.email());
        assertEquals("john_doe", response.username());
        assertEquals("keycloak123", response.keycloakId());
    }

    @Test
    public void shouldHandleNullUser() {
        assertNull(userMapper.userToUserResponse(null), "Mapping null user should return null response.");
    }

    @Test
    public void shouldHandleNullUserRequest() {
        User result = userMapper.userRequestToUser(null);
        assertNull(result, "Mapping null user request should return null user.");
    }

    @Test
    public void shouldMapEmptyUserRequestFields() {
        UserRequest request = new UserRequest("", "", "", "", null, null, null);
        User user = userMapper.userRequestToUser(request);

        assertTrue(user.getEmail().isEmpty(), "Email should be empty.");
        assertTrue(user.getUsername().isEmpty(), "Username should be empty.");
        assertTrue(user.getKeycloakId().isEmpty(), "Keycloak ID should be empty.");
    }
}
