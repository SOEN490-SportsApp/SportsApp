package app.sportahub.userservice.controller;

import app.sportahub.userservice.config.auth.TestSecurityConfig;
import app.sportahub.userservice.controller.auth.AuthController;
import app.sportahub.userservice.dto.request.auth.LoginRequest;
import app.sportahub.userservice.dto.request.auth.SendVerificationEmailRequest;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.service.auth.AuthServiceImpl;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("user-service.test")
@WebMvcTest(AuthController.class)
@Import({TestSecurityConfig.class, AuthServiceImpl.class})
public class AuthControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    private AuthServiceImpl authService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequest validLoginRequest;
    private LoginResponse loginResponse;
    private SendVerificationEmailRequest sendVerificationEmailRequest;
    @SneakyThrows
    @BeforeEach
    public void setUp() {
        validLoginRequest = new LoginRequest("danDuguay", "mypassword");
        sendVerificationEmailRequest = new SendVerificationEmailRequest("test@gmail.com");
        TokenResponse tokenResponse = new TokenResponse("accessTokenResponse", "refreshTokenResponse");
        loginResponse = new LoginResponse("userIDResponse", tokenResponse);

        when(authService.loginUser(any())).thenReturn(loginResponse);
    }

    @SneakyThrows
    @Test
    public void shouldLoginUserSuccessfully() {
        Assertions.assertEquals(loginResponse, authService.loginUser(validLoginRequest));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.userID").value(loginResponse.userID()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenResponse.accessToken").value(loginResponse.tokenResponse().accessToken()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tokenResponse.refreshToken").value(loginResponse.tokenResponse().refreshToken()));
    }

    @SneakyThrows
    @Test
    public void shouldSendVerificationEmailSuccessfully() {
        mockMvc.perform(MockMvcRequestBuilders.put("/auth/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendVerificationEmailRequest)))
                .andExpect(status().isOk());
    }

    @SneakyThrows
    @Test
    public void shouldReturnInternalServerErrorOnUnexpectedException() {

        doThrow(new UserDoesNotExistException(sendVerificationEmailRequest.email()))
                .when(authService).sendVerificationEmail(sendVerificationEmailRequest.email());

        mockMvc.perform(MockMvcRequestBuilders.put("/auth/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendVerificationEmailRequest)))
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("User with id:" + sendVerificationEmailRequest.email() + "does not exist."));
    }
}
