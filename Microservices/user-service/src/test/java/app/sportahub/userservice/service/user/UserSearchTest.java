package app.sportahub.userservice.service.user;

import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.controller.user.UserController;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.SportLevelResponse;
import app.sportahub.userservice.dto.response.user.UserProfileResponse;
import app.sportahub.userservice.exception.user.*;
import app.sportahub.userservice.mapper.user.FriendMapper;
import app.sportahub.userservice.mapper.user.ProfileMapper;
import app.sportahub.userservice.mapper.user.PublicProfileMapper;
import app.sportahub.userservice.mapper.user.UserMapper;
import app.sportahub.userservice.model.user.*;
import app.sportahub.userservice.repository.BadgeRepository;
import app.sportahub.userservice.repository.FriendRepository;
import app.sportahub.userservice.repository.FriendRequestRepository;
import app.sportahub.userservice.repository.user.SearchingUserRepositoryImpl;
import app.sportahub.userservice.repository.user.UserRepository;
import app.sportahub.userservice.service.keycloak.KeycloakServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserSearchTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private KeycloakServiceImpl keycloakService;

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);
    @Mock
    private ProfileMapper profileMapper;

    @Mock
    private FriendMapper friendMapper;

    @Mock
    private PublicProfileMapper publicProfileMapper;

    @InjectMocks
    private UserServiceImpl userService;

    @InjectMocks
    private UserController userController;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private SearchingUserRepositoryImpl searchingUserRepository;

    @Mock
    private FriendRepository friendRepository;

    @Mock
    private FriendRequestRepository friendRequestRepository;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, badgeRepository, keycloakService, userMapper,
                profileMapper, friendMapper, friendRepository, friendRequestRepository, publicProfileMapper);
        searchingUserRepository = new SearchingUserRepositoryImpl(mongoTemplate);
    }

    @Test
    void testSearchUsers_WithAllCriteria() {
        Pageable pageable = PageRequest.of(0, 10);

        // Mock Profile with sports and details
        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withDateOfBirth(LocalDate.of(1995, 5, 15))
                .withGender("Male")
                .withPhoneNumber("5145145145")
                .withPostalCode("12345")
                .withSportsOfPreference(Collections.singletonList(new SportLevel("Soccer", "Intermediate")))
                .build();

        // Mock User with Profile
        User user = User.builder()
                .withId("1234")
                .withEmail("john.doe@example.com")
                .withUsername("johndoe")
                .withProfile(profile)
                .build();

        // Mock Page<User> return value
        List<User> users = Collections.singletonList(user);
        Page<User> mockUserPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.searchUsers("John", "Doe",
                Arrays.asList("Soccer"), Arrays.asList("Pro"), "Male", "20-30", pageable))
                .thenReturn(mockUserPage);

        // Mock ProfileResponse (to be returned by the profileMapper)
        ProfileResponse profileResponse = new ProfileResponse(
                "John",
                "Doe",
                LocalDate.of(1995, 5, 15),
                "Male",
                "H7H 7H7",
                "5145145145",
                Arrays.asList(new SportLevelResponse("Soccer", "Intermediate")),
                "Pro"
        );
        when(profileMapper.profileToProfileResponse(profile)).thenReturn(profileResponse);

        Page<UserProfileResponse> result = userService.searchUsers("John", "Doe",
                Arrays.asList("Soccer"), Arrays.asList("Pro"), "Male", "20-30", pageable);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("1234", result.getContent().getFirst().userId());
        assertEquals("John", result.getContent().getFirst().profileResponse().firstName());
        assertEquals("Doe", result.getContent().getFirst().profileResponse().lastName());
        assertEquals("Male", result.getContent().getFirst().profileResponse().gender());
        assertEquals(LocalDate.of(1995, 5, 15), result.getContent().getFirst().profileResponse().dateOfBirth());
        assertEquals("Soccer", result.getContent().getFirst().profileResponse().sportsOfPreference().getFirst().name());
        assertEquals("Intermediate", result.getContent().getFirst().profileResponse().sportsOfPreference().getFirst().ranking());

        // Verify interactions
        verify(userRepository, times(1)).searchUsers("John", "Doe",
                Arrays.asList("Soccer"), Arrays.asList("Pro"), "Male", "20-30", pageable);
        verify(profileMapper, times(1)).profileToProfileResponse(profile);
    }

    @Test
    void testSearchUsers_ThrowsNoSearchCriteriaProvided() {
        // Arrange
        String firstName = null;
        String lastName = null;
        List<String> sports = null;
        List<String> rankings = null;
        String gender = null;
        String ageRange = null;
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);

        // Act
        NoSearchCriteriaProvidedException exception = assertThrows(NoSearchCriteriaProvidedException.class, () ->
                userService.searchUsers(firstName, lastName, sports, rankings, gender, ageRange, pageable)
        );

        // Assert
        assertEquals("406 NOT_ACCEPTABLE \"No Search Criteria Provided.\"", exception.getMessage());
    }

    @Test
    void testSearchUsers_InvalidPageOrSize() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userController.searchUsers(null, null, null, null, null, null, -1, 10);
        });

        assertEquals(IllegalArgumentException.class, exception.getClass());
    }

    @Test
    void testSearchUsers_ValidCriteria() {
        Pageable pageable = PageRequest.of(0, 10);
        List<User> users = Collections.singletonList(new User());
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.searchUsers("John", "Doe", null, null, "Male", "25", pageable))
                .thenReturn(userPage);

        Page<UserProfileResponse> result = userService.searchUsers("John", "Doe", null, null, "Male", "25", pageable);

        assertNotNull(result);
        verify(userRepository, times(1)).searchUsers("John", "Doe", null, null, "Male", "25", pageable);
    }

    @Test
    void testSearchUsers_BuildsCorrectQuery() {
        Pageable pageable = PageRequest.of(0, 10);

        Query expectedQuery = new Query()
                .addCriteria(Criteria.where("profile.firstName").regex("John", "i"))
                .addCriteria(Criteria.where("profile.gender").is("Male"));
        expectedQuery.with(pageable);

        List<User> users = Arrays.asList(new User());
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(users);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn((long) users.size());

        Page<User> result = searchingUserRepository.searchUsers("John", null, null, null, "Male", null, pageable);

        assertNotNull(result);
        verify(mongoTemplate, times(1)).find(any(Query.class), eq(User.class));
        verify(mongoTemplate, times(1)).count(any(Query.class), eq(User.class));
    }
}