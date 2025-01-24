package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.model.user.Profile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

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
}
