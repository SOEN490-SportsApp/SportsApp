package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.SportLevelRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.SportLevelResponse;
import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.SportLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ProfileMapperTest {

    private ProfileMapper profileMapper;

    @BeforeEach
    public void setup() {
        profileMapper = Mappers.getMapper(ProfileMapper.class);
    }

    @Test
    public void shouldMapProfileToProfileResponse() {
        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withDateOfBirth(LocalDate.of(1990, 1, 1))
                .withGender("Male")
                .build();

        ProfileResponse response = profileMapper.profileToProfileResponse(profile);
        assertNotNull(response);
        assertEquals("John", response.firstName());
        assertEquals("Doe", response.lastName());
        assertEquals(LocalDate.of(1990, 1, 1), response.dateOfBirth());
        assertEquals("Male", response.gender());
    }

    @Test
    public void shouldMapProfileRequestToProfile() {
        ProfileRequest request = new ProfileRequest("John", "Doe", LocalDate.of(1990, 1, 1), "Male", "12345", "555-1234", null, "Amateur");

        Profile profile = profileMapper.profileRequestToProfile(request);
        assertNotNull(profile);
        assertEquals("John", profile.getFirstName());
        assertEquals("Doe", profile.getLastName());
        assertEquals(LocalDate.of(1990, 1, 1), profile.getDateOfBirth());
        assertEquals("Male", profile.getGender());
    }

    @Test
    public void shouldPatchProfileFromRequest() {
        Profile profile = Profile.builder()
                .withFirstName("Jane")
                .withLastName("Doe")
                .build();
        ProfileRequest request = new ProfileRequest("John", null, null, "Male", "12345", "555-1234", null, "Amateur");

        profileMapper.patchProfileFromRequest(request, profile);
        assertEquals("John", profile.getFirstName());
        assertEquals("Doe", profile.getLastName());
        assertEquals("Male", profile.getGender());
    }

    @Test
    public void shouldHandleNullProfile() {
        assertNull(profileMapper.profileToProfileResponse(null), "Mapping null profile should return null response.");
    }

    @Test
    public void shouldHandleNullProfileRequest() {
        Profile result = profileMapper.profileRequestToProfile(null);
        assertNull(result, "Mapping null profile request should return null profile.");
    }

    @Test
    public void shouldHandleNullValuesInProfileRequest() {
        ProfileRequest request = new ProfileRequest(null, null, null, null, null, null, null, null);
        Profile profile = profileMapper.profileRequestToProfile(request);

        assertNull(profile.getFirstName(), "First name should be null.");
        assertNull(profile.getLastName(), "Last name should be null.");
        assertNull(profile.getDateOfBirth(), "Date of birth should be null.");
        assertNull(profile.getGender(), "Gender should be null.");
    }
    @Test
    public void shouldSetSportsOfPreferenceWhenListIsNull() {
        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withSportsOfPreference(null)
                .build();

        List<SportLevelRequest> sportLevelRequests = new ArrayList<>();
        sportLevelRequests.add(new SportLevelRequest("Soccer", "Beginner"));
        sportLevelRequests.add(new SportLevelRequest("Tennis", "Intermediate"));

        profileMapper.patchProfileFromRequest(
                new ProfileRequest("John", "Doe", null, null, null, null, sportLevelRequests, null),
                profile
        );

        assertNotNull(profile.getSportsOfPreference());
        assertEquals(2, profile.getSportsOfPreference().size());
        assertEquals("Soccer", profile.getSportsOfPreference().get(0).getName());
    }

    @Test
    public void shouldReplaceSportsOfPreferenceWhenListExists() {
        List<SportLevel> existingSports = new ArrayList<>();
        existingSports.add(new SportLevel("Basketball", "Advanced"));

        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withSportsOfPreference(existingSports)
                .build();

        List<SportLevelRequest> sportLevelRequests = new ArrayList<>();
        sportLevelRequests.add(new SportLevelRequest("Soccer", "Beginner"));
        sportLevelRequests.add(new SportLevelRequest("Tennis", "Intermediate"));

        profileMapper.patchProfileFromRequest(
                new ProfileRequest("John", "Doe", null, null, null, null, sportLevelRequests, null),
                profile
        );

        assertNotNull(profile.getSportsOfPreference());
        assertEquals(2, profile.getSportsOfPreference().size());
        assertEquals("Soccer", profile.getSportsOfPreference().get(0).getName());
    }
    @Test
    public void shouldHandleNullSportsPreferencesInProfileToResponse() {
        Profile profile = Profile.builder()
                .withFirstName("John")
                .withLastName("Doe")
                .withDateOfBirth(LocalDate.of(1990, 1, 1))
                .withGender("Male")
                .withSportsOfPreference(null)  // Set sports preferences to null
                .build();

        ProfileResponse response = profileMapper.profileToProfileResponse(profile);
        assertNotNull(response);
        assertNull(response.sportsOfPreference(), "Sports preferences should be null in response.");
    }

    @Test
    public void shouldHandleNullSportsPreferencesInRequestToProfile() {
        ProfileRequest request = new ProfileRequest("John", "Doe", LocalDate.of(1990, 1, 1), "Male", "12345", "555-1234", null, "Amateur");

        Profile profile = profileMapper.profileRequestToProfile(request);
        assertNotNull(profile);
        assertNull(profile.getSportsOfPreference(), "Sports preferences should be null in mapped profile.");
    }

    @Test
    public void shouldConvertEmptySportsPreferences() {
        ProfileRequest request = new ProfileRequest("John", "Doe", LocalDate.of(1990, 1, 1), "Male", "12345", "555-1234", Collections.emptyList(), "Amateur");

        Profile profile = profileMapper.profileRequestToProfile(request);
        assertNotNull(profile);
        assertTrue(profile.getSportsOfPreference().isEmpty(), "Sports preferences should be empty but not null.");
    }
}
