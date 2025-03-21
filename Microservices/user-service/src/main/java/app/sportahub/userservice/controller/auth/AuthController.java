package app.sportahub.userservice.controller.auth;

import app.sportahub.userservice.dto.request.auth.*;
import app.sportahub.userservice.dto.response.auth.LoginResponse;
import app.sportahub.userservice.dto.response.auth.TokenResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.service.auth.AuthService;
import app.sportahub.userservice.service.kafka.producer.OrchestrationServiceProducer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Operations related to authentication and authorization")
public class AuthController {

    private final AuthService authService;
    private final OrchestrationServiceProducer orchestrationServiceProducer;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new user",
            description = "Creates a new user account based on the provided registration details.")
    public UserResponse registerUser(@RequestBody RegistrationRequest registrationRequest) {
        return authService.registerUser(registrationRequest);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "User login",
            description = "Authenticates a user and returns an access token and refresh token.")
    public LoginResponse loginUser(@RequestBody LoginRequest loginRequest) {
        return authService.loginUser(loginRequest);
    }

    @PostMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Refresh access token",
            description = "Generates a new access token using the provided refresh token.")
    public TokenResponse refreshToken(@RequestBody RefreshTokenRequest tokenRequest) {
        return authService.refreshToken(tokenRequest);
    }

    @PutMapping("/send-verification-email")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "send verification email",
            description = "Sends a verification email to the specified user. This email contains a link or token that the user must use to confirm their email address and complete the registration."
    )
    public void sendVerificationEmail(@RequestBody SendVerificationEmailRequest sendVerificationEmailRequest) {
        authService.sendVerificationEmail(sendVerificationEmailRequest.email());
    }

    @PutMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Send password reset email",
               description = "Sends an email to the specified user containing a temporary token to be used to update the password.")
    public void sendPasswordResetEmail(@Valid @RequestBody SendPasswordResetEmailRequest sendPasswordResetEmail){
        authService.sendPasswordResetEmail(sendPasswordResetEmail.email());
        orchestrationServiceProducer.sendPasswordResetEmailUsingKafka(sendPasswordResetEmail.email());
    }
}

