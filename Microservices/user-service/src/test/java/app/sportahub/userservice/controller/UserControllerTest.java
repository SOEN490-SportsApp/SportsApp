package app.sportahub.userservice.controller;

import app.sportahub.userservice.model.user.Profile;
import app.sportahub.userservice.model.user.User;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserRequest validUserRequest;
    private User user;

    @BeforeEach
    public void setUp() {
        validUserRequest = new UserRequest(
                "test@example.com",
                "testuser",
                "password123",
                "John",
                "Doe",
                LocalDate.of(2000, 1, 1),
                "123-456-7890",
                "A"
        );

        user = User.builder()
                .withEmail("test@example.com")
                .withUsername("testuser")
                .withProfile(Profile.builder()
                        .withFirstName("John")
                        .withLastName("Doe")
                        .withDateOfBirth(LocalDate.of(2000, 1, 1))
                        .withPhoneNumber("123-456-7890")
                        .withRanking("A")
                        .build())
                .build();
    }

    @Test
    public void shouldCreateUserSuccessfully() throws Exception {
        when(userService.createUser(any(UserRequest.class))).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUserRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value(user.getEmail()))
                .andExpect(jsonPath("$.username").value(user.getUsername()))
                .andExpect(jsonPath("$.profile.firstName").value(user.getProfile().getFirstName()))
                .andExpect(jsonPath("$.profile.lastName").value(user.getProfile().getLastName()))
                .andExpect(jsonPath("$.profile.dateOfBirth").value(user.getProfile().getDateOfBirth().toString()))
                .andExpect(jsonPath("$.profile.phoneNumber").value(user.getProfile().getPhoneNumber()))
                .andExpect(jsonPath("$.profile.ranking").value(user.getProfile().getRanking()));

        verify(userService).createUser(any(UserRequest.class));
    }

    @Test
    public void shouldReturnBadRequestWhenUserRequestIsInvalid() throws Exception {
        UserRequest invalidRequest = new UserRequest(
                "",
                "",
                "",
                null,
                null,
                null,
                null,
                null
        );

        mockMvc.perform(MockMvcRequestBuilders.post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email must be provided"))
                .andExpect(jsonPath("$.errors.username").value("Username must be provided"))
                .andExpect(jsonPath("$.errors.password").value("Password must be provided"));
    }
}