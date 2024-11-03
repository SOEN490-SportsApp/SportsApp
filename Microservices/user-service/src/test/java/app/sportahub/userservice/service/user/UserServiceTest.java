package app.sportahub.userservice.service.user;

import app.sportahub.userservice.exception.user.UserEmailAlreadyExists;
import app.sportahub.userservice.exception.user.UsernameAlreadyExists;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import app.sportahub.userservice.dto.request.user.UserRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void createUserShouldReturnSuccessfulCreation() {
        // Arrange
        UserRequest userRequest = new UserRequest("test@example.com", "testUser", "123", "John", "Doe",
                LocalDate.of(1990, 1, 1), "1234567890", "100");

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(null);
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(null);

        User savedUser = User.builder()
                .withId("123")
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withEmail(userRequest.email())
                .withUsername(userRequest.username())
                .withProfile(Profile.builder()
                        .withFirstName(userRequest.firstName())
                        .withLastName(userRequest.lastName())
                        .withDateOfBirth(userRequest.dateOfBirth())
                        .withPhoneNumber(userRequest.phoneNumber())
                        .withRanking(userRequest.ranking())
                        .build())
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.createUser(userRequest);

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals("123", result.getId());
        Assertions.assertEquals(userRequest.email(), result.getEmail());
        Assertions.assertEquals(userRequest.username(), result.getUsername());
        Assertions.assertEquals(userRequest.firstName(), result.getProfile().getFirstName());
        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowEmailAlreadyExists() {
        UserRequest userRequest = new UserRequest("test@example.com", "testUser", "123", "John", "Doe",
                LocalDate.of(1990, 1, 1), "1234567890", "100");

        User existingUser = new User();
        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(existingUser);

        UserEmailAlreadyExists exception = Assertions.assertThrows(UserEmailAlreadyExists.class,
                () -> userService.createUser(userRequest));
        Assertions.assertEquals("409 CONFLICT \"User with this email:test@example.com already exists.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, never()).findUserByUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowUsernameAlreadyExists() {
        UserRequest userRequest = new UserRequest("test@example.com", "testUser", "123", "John", "Doe",
                LocalDate.of(1990, 1, 1), "1234567890", "100");

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(null);
        User existingUser = new User();
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(existingUser);

        UsernameAlreadyExists exception = Assertions.assertThrows(UsernameAlreadyExists.class,
                () -> userService.createUser(userRequest));
        Assertions.assertEquals("409 CONFLICT \"User with this username:testUser already exists.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, never()).save(any(User.class));
    }
}
