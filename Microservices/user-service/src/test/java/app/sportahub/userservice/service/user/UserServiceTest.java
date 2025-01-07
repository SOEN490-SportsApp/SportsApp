package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.dto.request.user.*;
import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.dto.response.user.friend.FriendRequestResponse;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.SportLevelResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.friend.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.exception.user.*;
import app.sportahub.userservice.exception.user.badge.UserAlreadyAssignedBadgeByThisGiverException;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.*;
import app.sportahub.userservice.repository.BadgeRepository;
import app.sportahub.userservice.repository.UserRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private KeycloakApiClient keycloakApiClient;

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);
    private final ProfileMapper profileMapper = Mappers.getMapper(ProfileMapper.class);

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, badgeRepository,
                keycloakApiClient, userMapper, profileMapper);
    }

    private UserRequest getUserRequest() {
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of(new SportLevelRequest("Basketball", "Intermediate"),
                        new SportLevelRequest("Soccer", "Beginner")),
                "A"
        );

        PreferencesRequest preferences = new PreferencesRequest(true, "english");

        UserRequest userRequest = new UserRequest(
                "keycloak-123",
                "test@example.com",
                "testUser",
                "123",
                profileRequest,
                preferences,
                new ArrayList<>()
        );
        return userRequest;
    }

    @Test
    public void createUserShouldReturnSuccessfulCreation() {
        // Arrange
        UserRequest userRequest = getUserRequest();

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(Optional.empty());
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(Optional.empty());

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
        UserResponse result = userService.createUser(userRequest);

        // Assert
        assertNotNull(result);
        assertEquals("123", result.id());
        assertEquals(userRequest.email(), result.email());
        assertEquals(userRequest.username(), result.username());
        assertEquals(userRequest.profile().firstName(), result.profile().firstName());
        assertEquals(userRequest.profile().lastName(), result.profile().lastName());
        assertEquals(userRequest.profile().dateOfBirth(), result.profile().dateOfBirth());
        assertEquals(userRequest.profile().phoneNumber(), result.profile().phoneNumber());
        assertEquals(userRequest.profile().ranking(), result.profile().ranking());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowEmailAlreadyExists() {
        // Arrange
        UserRequest userRequest = getUserRequest();
        User existingUser = User.builder()
                .withKeycloakId("keycloak-123")
                .withEmail(userRequest.email())
                .withUsername(userRequest.username())
                .build();

        // Mock
        when(userRepository.findUserByEmail(anyString())).thenReturn(Optional.of(existingUser));

        // Act & Assert
        UserEmailAlreadyExistsException exception = assertThrows(
                UserEmailAlreadyExistsException.class,
                () -> userService.createUser(userRequest)
        );

        assertEquals(
                "409 CONFLICT \"User with this email:test@example.com already exists.\"",
                exception.getMessage()
        );

        // Verify interactions
        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, never()).findUserByUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void createUserShouldThrowUsernameAlreadyExists() {
        UserRequest userRequest = getUserRequest();

        when(userRepository.findUserByEmail(userRequest.email())).thenReturn(Optional.empty());
        Optional<User> existingUser = Optional.of(new User());
        when(userRepository.findUserByUsername(userRequest.username())).thenReturn(existingUser);

        UsernameAlreadyExistsException exception = assertThrows(UsernameAlreadyExistsException.class,
                () -> userService.createUser(userRequest));
        assertEquals("409 CONFLICT \"User with this username:testUser already exists.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserByEmail(userRequest.email());
        verify(userRepository, times(1)).findUserByUsername(userRequest.username());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void getUserByIdShouldReturnUser() {
        String userId = "123";
        Optional<User> expectedUser = Optional.of(User.builder()
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
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                .build());

        when(userRepository.findUserById(any())).thenReturn(expectedUser);

        UserResponse result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals(userId, result.id());
        assertEquals("test@example.com", result.email());
        assertEquals("testUser", result.username());
        assertEquals("John", result.profile().firstName());
        assertEquals("Doe", result.profile().lastName());
        assertEquals(LocalDate.of(1990, 1, 1), result.profile().dateOfBirth());
        assertEquals("Male", result.profile().gender());
        assertEquals("12345", result.profile().postalCode());
        assertEquals("1234567890", result.profile().phoneNumber());
        assertEquals(List.of(new SportLevelResponse("Basketball", "Intermediate"),
                        new SportLevelResponse("Soccer", "Beginner")),
                result.profile().sportsOfPreference());
        assertEquals("100", result.profile().ranking());

        verify(userRepository, times(1)).findUserById(userId);
    }

    @Test
    public void getUserByIdShouldThrowUserDoesNotExistException() {
        String userId = new ObjectId().toHexString();

        UserDoesNotExistException exception = assertThrows(
                UserDoesNotExistException.class,
                () -> userService.getUserById(userId)
        );

        assertEquals(
                "404 NOT_FOUND \"User with identifier: " + userId + " does not exist.\"",
                exception.getMessage()
        );
    }

    @Test
    public void updateUserProfileShouldReturnOK() {
        Optional<User> existingUser = Optional.of(User.builder()
                .withProfile(Profile.builder().build())
                .withEmail("test@example.com")
                .withUsername("testUser")
                .withKeycloakId("keycloak-123")
                .withPreferences(Preferences.builder().build())
                .build());
        ProfileRequest profileRequest = new ProfileRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "M",
                "12345",
                "123-456-7890",
                List.of(new SportLevelRequest("Basketball", "Intermediate"),
                        new SportLevelRequest("Soccer", "Beginner")),
                "A"
        );

        existingUser.get().setProfile(Profile.builder()
                .withFirstName(profileRequest.firstName())
                .withLastName(profileRequest.lastName())
                .withDateOfBirth(profileRequest.dateOfBirth())
                .withRanking(profileRequest.ranking())
                .withPhoneNumber(profileRequest.phoneNumber())
                .withGender(profileRequest.gender())
                .withPostalCode(profileRequest.postalCode())
                .withSportsOfPreference(profileRequest.sportsOfPreference()
                        .stream().map(sportLevelRequest ->
                                new SportLevel(sportLevelRequest.name(), sportLevelRequest.ranking()))
                        .toList())
                .build());


        when(userRepository.findUserById(existingUser.get().getId())).thenReturn(existingUser);
        when(userRepository.save(any(User.class))).thenReturn(existingUser.get());
        when(keycloakApiClient.updateUser(anyString(), any(KeycloakRequest.class)))
                .thenReturn(Mono.empty());

        ProfileResponse updatedProfile = userService.updateUserProfile(existingUser.get().getId(), profileRequest);

        assertNotNull(updatedProfile);
        assertEquals(updatedProfile.firstName(), profileRequest.firstName());
        assertEquals(updatedProfile.lastName(), profileRequest.lastName());
        assertEquals(updatedProfile.dateOfBirth(), profileRequest.dateOfBirth());
        assertEquals(updatedProfile.phoneNumber(), profileRequest.phoneNumber());
        assertEquals(updatedProfile.ranking(), profileRequest.ranking());
        assertEquals(updatedProfile.gender(), profileRequest.gender());
        assertEquals(updatedProfile.postalCode(), profileRequest.postalCode());
        assertEquals(updatedProfile.sportsOfPreference(), profileRequest.sportsOfPreference()
                .stream()
                .map(sportLevelRequest -> new SportLevelResponse(
                        sportLevelRequest.name(), sportLevelRequest.ranking()))
                .toList());

        verify(userRepository, times(1)).findUserById(existingUser.get().getId());
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
                List.of(new SportLevelRequest("Basketball", "Intermediate"),
                        new SportLevelRequest("Soccer", "Beginner")),
                "A"
        );

        when(userRepository.findUserById("1")).thenReturn(Optional.empty());
        UserDoesNotExistException exception = assertThrows(UserDoesNotExistException.class,
                () -> userService.updateUserProfile("1", profileRequest));

        assertEquals("404 NOT_FOUND \"User with identifier: 1 does not exist.\"", exception.getMessage());

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
                "A",
                List.of(new SportLevel("Basketball", "Intermediate"),
                        new SportLevel("Soccer", "Beginner")),
                List.of()
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

        Optional<User> optionalExistingUser = Optional.of(new User("keycloak-123", "test@gmail.com", "testusername", existingProfile, null, null));
        User existingUser = optionalExistingUser.get();
        when(userRepository.findUserById(existingUser.getId())).thenReturn(optionalExistingUser);
        existingUser.getProfile().setDateOfBirth(profileRequest.dateOfBirth());
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        ProfileResponse updatedProfile = userService.patchUserProfile(existingUser.getId(), profileRequest);

        assertNotNull(updatedProfile);
        assertEquals(updatedProfile.dateOfBirth(), profileRequest.dateOfBirth());

        verify(userRepository, times(1)).findUserById(existingUser.getId());
        verify(userRepository, times(1)).save(any(User.class));

    }

    @Test
    public void patchUserProfileShouldThrowUserNotFound() {
        ProfileRequest profileRequest = new ProfileRequest("John", null, null, null, null, null, null, null);

        when(userRepository.findUserById("1")).thenReturn(Optional.empty());

        UserDoesNotExistException exception = assertThrows(UserDoesNotExistException.class,
                () -> userService.patchUserProfile("1", profileRequest));

        assertEquals("404 NOT_FOUND \"User with identifier: 1 does not exist.\"", exception.getMessage());

        verify(userRepository, times(1)).findUserById("1");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void assignBadge_Successfully() {
        User user = new User();
        Profile profile = new Profile();
        profile.setBadges(new ArrayList<>());
        user.setProfile(profile);

        when(userRepository.findById("user1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() -> userService.assignBadge("user1", "badge1", "giver1"));
    }

    @Test
    void assignBadge_ThrowsUserDoesNotExist() {
        when(userRepository.findById("user1")).thenReturn(Optional.empty());
        assertThrows(UserDoesNotExistException.class, () -> userService.assignBadge("user1", "badge1", "giver1"));
    }

    @Test
    void assignBadge_ThrowsAlreadyAssigned() {
        User user = new User();
        Profile profile = new Profile();
        ArrayList<UserBadge> badges = new ArrayList<>();
        badges.add(new UserBadge("badge1", "giver1"));
        profile.setBadges(badges);
        user.setProfile(profile);

        when(userRepository.findById("user1")).thenReturn(Optional.of(user));
        assertThrows(UserAlreadyAssignedBadgeByThisGiverException.class, () -> userService.assignBadge("user1", "badge1", "giver1"));
    }

    @Test
    void getUserBadges_ReturnsData() {
        User user = new User();
        Profile profile = new Profile();
        ArrayList<UserBadge> badges = new ArrayList<>();
        badges.add(new UserBadge("badge1", "giver1"));
        profile.setBadges(badges);
        user.setProfile(profile);

        Badge badge = new Badge();
        badge.setName("Achievement");
        badge.setDescription("Awarded for special achievement");
        badge.setIconUrl("url_to_icon");

        when(userRepository.findById("user1")).thenReturn(Optional.of(user));
        when(badgeRepository.findById("badge1")).thenReturn(Optional.of(badge));

        assertFalse(userService.getUserBadges("user1").isEmpty());
    }

    @Test
    void getUserBadges_UserNotFound() {
        when(userRepository.findById("user1")).thenReturn(Optional.empty());
        assertThrows(UserDoesNotExistException.class, () -> userService.getUserBadges("user1"));
    }

    @Test
    void sendFriendRequestShouldReturnSuccess() {
        // Arrange
        String senderId = "sender";
        Optional<User> sendUser = Optional.of(User.builder()
                .withId(senderId)
                .withEmail("test@example.com")
                .withUsername("sender")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                .build());

        String receiverId = "receiver";
        Optional<User> receiverUser = Optional.of(User.builder()
                .withId(receiverId)
                .withEmail("test@example.com")
                .withUsername("receiver")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                .build());

        when(userRepository.findUserById(senderId)).thenReturn(sendUser);
        when(userRepository.findUserByUsername(receiverUser.get().getUsername())).thenReturn(receiverUser);
        User send = sendUser.get();
        User receiver = receiverUser.get();

        when(userRepository.save(send)).thenReturn(send);
        when(userRepository.save(receiver)).thenReturn(receiver);

        // Act
        FriendRequestResponse response = userService.sendFriendRequest(sendUser.get().getId(),
                new FriendRequestRequest(receiverUser.get().getUsername()));

        // Assert
        assertNotNull(response);
        assertEquals("Friend request sent successfully.",response.message());
        assertFalse(send.getFriendList().isEmpty());
        assertFalse(receiver.getFriendList().isEmpty());
        assertEquals(FriendRequestStatusEnum.SENT, send.getFriendList().getFirst().getFriendRequestStatus());
        assertEquals(FriendRequestStatusEnum.RECEIVED, receiver.getFriendList().getFirst().getFriendRequestStatus());
    }

    @Test
    void sendFriendRequestShouldThrowUserDoesNotExistException() {
        // Arrange
        String userId = new ObjectId().toHexString();

        // Act
        UserDoesNotExistException exception = assertThrows(UserDoesNotExistException.class,
                () -> userService.sendFriendRequest(userId, new FriendRequestRequest("test") ));

        // Assert
        assertEquals("404 NOT_FOUND \"User with identifier: " + userId + " does not exist.\"", exception.getMessage());
    }

    @Test
    void sendFriendRequestShouldThrowUserAlreadyInFriendListException() {
        // Arrange

        List<Friend> senderFriendList = new ArrayList<>();
        senderFriendList.add(new Friend("receiver", FriendRequestStatusEnum.SENT));

        List<Friend> receiverFriendList = new ArrayList<>();
        receiverFriendList.add(new Friend("sender", FriendRequestStatusEnum.RECEIVED));

        String senderId = "sender";
        Optional<User> sendUser = Optional.of(User.builder()
                .withId(senderId)
                .withEmail("test@example.com")
                .withUsername("sender")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                        .withFriendList(senderFriendList)
                .build());

        String receiverId = "receiver";
        Optional<User> receiverUser = Optional.of(User.builder()
                .withId(receiverId)
                .withEmail("test@example.com")
                .withUsername("receiver")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                        .withFriendList(receiverFriendList)
                .build());

        when(userRepository.findUserById(senderId)).thenReturn(sendUser);
        when(userRepository.findUserByUsername(receiverUser.get().getUsername())).thenReturn(receiverUser);
        User send = sendUser.get();
        User receiver = receiverUser.get();

        // Act
        UserAlreadyInFriendListException exception = assertThrows(UserAlreadyInFriendListException.class,
                () -> userService.sendFriendRequest(sendUser.get().getId(),
                new FriendRequestRequest(receiverUser.get().getUsername())));

        // Assert
        assertEquals("409 CONFLICT \"User with username: " + receiver.getUsername() + " and status: "
                + send.getFriendList().getFirst().getFriendRequestStatus() + " already in friend list.\"", exception.getMessage());
    }

    @Test
    void sendFriendRequestShouldThrowUserSentFriendRequestToSelfException() {
        // Arrange
        String senderId = "sender";
        Optional<User> sendUser = Optional.of(User.builder()
                .withId(senderId)
                .withEmail("test@example.com")
                .withUsername("sender")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(1990, 1, 1))
                        .withGender("Male")
                        .withPostalCode("12345")
                        .withPhoneNumber("1234567890")
                        .withSportsOfPreference(
                                List.of(new SportLevel("Basketball", "Intermediate"),
                                        new SportLevel("Soccer", "Beginner")))
                        .withRanking("100")
                        .build())
                .build());

        when(userRepository.findUserById(senderId)).thenReturn(sendUser);
        when(userRepository.findUserByUsername(sendUser.get().getUsername())).thenReturn(sendUser);
        User send = sendUser.get();

        // Act
        UserSentFriendRequestToSelfException exception = assertThrows(UserSentFriendRequestToSelfException.class,
                () -> userService.sendFriendRequest(senderId, new FriendRequestRequest(send.getUsername())));

        // Assert
        assertEquals("409 CONFLICT \"Can't send friend request to self\"", exception.getMessage());
    }

    @Test
    void getFriendRequestsShouldReturnSuccess() {
        // Arrange
        User user = new User();
        user.setUsername("testUsername");
        List<Friend> friendList = new ArrayList<>();
        friendList.add(new Friend("sender", FriendRequestStatusEnum.SENT));
        friendList.add(new Friend("receiver", FriendRequestStatusEnum.RECEIVED));
        user.setFriendList(friendList);

        // Act
        when(userRepository.findUserById("id")).thenReturn(Optional.of(user));

        // Assert
        List<ViewFriendRequestsResponse> listResponse = userService.getFriendRequests("id");
        assertFalse(listResponse.isEmpty());
        assertEquals(1, listResponse.size());
        assertEquals("receiver", listResponse.getFirst().userName());
    }

    @Test
    void getFriendRequestsShouldThrowUserDoesNotExistException() {
        // Arrange
        String userId = new ObjectId().toHexString();

        // Act
        UserDoesNotExistException exception = assertThrows(UserDoesNotExistException.class,
                () -> userService.getFriendRequests(userId));

        // Assert
        assertEquals("404 NOT_FOUND \"User with identifier: " + userId + " does not exist.\"", exception.getMessage());
    }
}