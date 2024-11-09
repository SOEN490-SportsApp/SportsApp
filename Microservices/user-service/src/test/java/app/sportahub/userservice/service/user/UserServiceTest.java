package app.sportahub.userservice.service.user;

import app.sportahub.userservice.dto.request.user.PreferencesRequest;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UserEmailAlreadyExistsException;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.exception.user.UsernameAlreadyExistsException;
import app.sportahub.userservice.model.user.Preferences;
import app.sportahub.userservice.model.user.Preferences;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.repository.UserRepository;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import app.sportahub.userservice.exception.user.UserDoesNotExistException;

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
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );

        PreferencesRequest preferences = new PreferencesRequest(true, "english");

        UserRequest userRequest = new UserRequest(
                "keycloak-123",
                "test@example.com",
                "testUser",
                "123",
                profileRequest,
                preferences
        );

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(null);
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(null);

        User savedUser = User.builder()
                .withId("123")
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withEmail(userRequest.email())
                .withUsername(userRequest.username())
                .withProfile(Profile.builder()
                        .withFirstName(userRequest.profile().firstName())
                        .withLastName(userRequest.profile().lastName())
                        .withDateOfBirth(userRequest.profile().dateOfBirth())
                        .withPhoneNumber(userRequest.profile().phoneNumber())
                        .withRanking(userRequest.profile().ranking())
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
        Assertions.assertEquals(userRequest.profile().firstName(), result.getProfile().getFirstName());
        Assertions.assertEquals(userRequest.profile().lastName(), result.getProfile().getLastName());
        Assertions.assertEquals(userRequest.profile().dateOfBirth(), result.getProfile().getDateOfBirth());
        Assertions.assertEquals(userRequest.profile().phoneNumber(), result.getProfile().getPhoneNumber());
        Assertions.assertEquals(userRequest.profile().ranking(), result.getProfile().getRanking());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowEmailAlreadyExists() {
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );

        PreferencesRequest preferences = new PreferencesRequest(true, "english");

        UserRequest userRequest = new UserRequest(
                "keycloak-123",
                "test@example.com",
                "testUser",
                "123",
                profileRequest,
                preferences
        );

        User existingUser = new User();
        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(existingUser);

        UserEmailAlreadyExistsException exception = Assertions.assertThrows(UserEmailAlreadyExistsException.class,
                () -> userService.createUser(userRequest));
        Assertions.assertEquals("409 CONFLICT \"User with this email:test@example.com already exists.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, never()).findUserByUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowUsernameAlreadyExists() {
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );

        PreferencesRequest preferences = new PreferencesRequest(true, "english");

        UserRequest userRequest = new UserRequest(
                "keycloak-123",
                "test@example.com",
                "testUser",
                "123",
                profileRequest,
                preferences
        );

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(null);
        User existingUser = new User();
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(existingUser);

        UsernameAlreadyExistsException exception = Assertions.assertThrows(UsernameAlreadyExistsException.class,
                () -> userService.createUser(userRequest));
        Assertions.assertEquals("409 CONFLICT \"User with this username:testUser already exists.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void getUserByIdShouldReturnUser() {
        String userId = "123";
        User expectedUser = User.builder()
                .withId(userId)
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(List.of("Basketball", "Soccer"))
                        .withRanking("100")
                        .build())
                .build();

        when(userRepository.findUserById(userId)).thenReturn(expectedUser);

        User result = userService.getUserById(userId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(userId, result.getId());
        Assertions.assertEquals("test@example.com", result.getEmail());
        Assertions.assertEquals("testUser", result.getUsername());
        Assertions.assertEquals("John", result.getProfile().getFirstName());
        Assertions.assertEquals("Doe", result.getProfile().getLastName());
        Assertions.assertEquals(LocalDate.of(1990, 1, 1), result.getProfile().getDateOfBirth());
        Assertions.assertEquals("Male", result.getProfile().getGender());
        Assertions.assertEquals("12345", result.getProfile().getPostalCode());
        Assertions.assertEquals("1234567890", result.getProfile().getPhoneNumber());
        Assertions.assertEquals(List.of("Basketball", "Soccer"), result.getProfile().getSportsOfPreference());
        Assertions.assertEquals("100", result.getProfile().getRanking());

        verify(userRepository, times(1)).findUserById(userId);
    }

    @Test
    public void getUserByIdShouldThrowUserDoesNotExistException() {
        String userId = "nonexistent";
        when(userRepository.findUserById(userId)).thenReturn(null);

        UserDoesNotExistException exception = Assertions.assertThrows(
                UserDoesNotExistException.class,
                () -> userService.getUserById(userId)
        );

        Assertions.assertEquals("404 NOT_FOUND \"User with id:" + userId + "does not exist.\"",
                exception.getMessage());
        verify(userRepository, times(1)).findUserById(userId);
    }

    @Test
    public void updateUserProfileShouldReturnOK() {
        User existingUser = User.builder()
                .withProfile(Profile.builder().build())
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withKeycloakId("keycloak-123")
                .withPreferences(Preferences.builder().build())
                .build();
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );

        existingUser.setProfile(Profile.builder()
                .withFirstName(profileRequest.firstName())
                .withLastName(profileRequest.lastName())
                .withDateOfBirth(profileRequest.dateOfBirth())
                .withRanking(profileRequest.ranking())
                .withPhoneNumber(profileRequest.phoneNumber())
                .withGender(profileRequest.gender())
                .withPostalCode(profileRequest.postalCode())
                .withSportsOfPreference(profileRequest.sportsOfPreference())
                .build());


        when(userRepository.findUserById(existingUser.getId())).thenReturn(existingUser);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        Profile updatedProfile = userService.updateUserProfile( existingUser.getId(), profileRequest);

        Assertions.assertNotNull(updatedProfile);
        Assertions.assertEquals(updatedProfile.getFirstName(), profileRequest.firstName());
        Assertions.assertEquals(updatedProfile.getLastName(), profileRequest.lastName());
        Assertions.assertEquals(updatedProfile.getDateOfBirth(), profileRequest.dateOfBirth());
        Assertions.assertEquals(updatedProfile.getPhoneNumber(), profileRequest.phoneNumber());
        Assertions.assertEquals(updatedProfile.getRanking(), profileRequest.ranking());
        Assertions.assertEquals(updatedProfile.getGender(), profileRequest.gender());
        Assertions.assertEquals(updatedProfile.getPostalCode(), profileRequest.postalCode());
        Assertions.assertEquals(updatedProfile.getSportsOfPreference(), profileRequest.sportsOfPreference());

        verify(userRepository, times(1)).findUserById(existingUser.getId());
        verify(userRepository, times(1)).save(any(User.class));

    }

    @Test
    public void updateUserProfileShouldThrowUserNotFound() {
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );

        when(userRepository.findUserById("1")).thenReturn(null);
        UserDoesNotExistException exception = Assertions.assertThrows(UserDoesNotExistException.class,
                ()-> userService.updateUserProfile("1", profileRequest) );

        Assertions.assertEquals("404 NOT_FOUND \"User with id:1does not exist.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserById("1");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void patchUserProfileShouldReturnOK() {
        Profile existingProfile = new Profile(
                "John",
                "Doe",
                LocalDate.now(),
                "M",
                "12345",
                "123-456-7890",
                List.of("Basketball", "Soccer"),
                "A"
        );
        ProfileRequest profileRequest = new ProfileRequest(
                null,
                null,
                existingProfile.getDateOfBirth().minusDays(1),
                null,
                null,
                null,
                null,
                null
        );

        User existingUser = new User("keycloak-123", "test@gmail.com", "testusername", existingProfile, null);

        when(userRepository.findUserById(existingUser.getId())).thenReturn(existingUser);

        existingUser.getProfile().setDateOfBirth(profileRequest.dateOfBirth());
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        Profile updatedProfile = userService.patchUserProfile(existingUser.getId(), profileRequest);

        Assertions.assertNotNull(updatedProfile);
        Assertions.assertEquals(updatedProfile.getDateOfBirth(), profileRequest.dateOfBirth());

        verify(userRepository, times(1)).findUserById(existingUser.getId());
        verify(userRepository, times(1)).save(any(User.class));

    }

    @Test
    public void patchUserProfileShouldThrowUserNotFound() {
        ProfileRequest profileRequest = new ProfileRequest("John", null, null, null, null ,null , null, null);

        when(userRepository.findUserById("1")).thenReturn(null);

        UserDoesNotExistException exception = Assertions.assertThrows(UserDoesNotExistException.class,
                ()-> userService.patchUserProfile("1", profileRequest) );

        Assertions.assertEquals("404 NOT_FOUND \"User with id:1does not exist.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserById("1");
        verify(userRepository, never()).save(any(User.class));
    }

}