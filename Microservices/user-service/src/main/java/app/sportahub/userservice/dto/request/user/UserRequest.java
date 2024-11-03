package app.sportahub.userservice.dto.request.user;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UserRequest(@NotBlank(message = "Email must be provided")
                          @NotNull(message = "Email must be provided")
                          @Email(message = "Valid email is required")
                          String email,

                          @NotBlank(message = "Username must be provided")
                          @NotNull(message = "Username must be provided")
                          String username,

                          @NotBlank(message = "Password must be provided")
                          @NotNull(message = "Password must be provided")
                          String password,

                          @Nullable
                          String firstName,

                          @Nullable
                          String lastName,

                          @Nullable
                          LocalDate dateOfBirth,

                          @Nullable
                          String phoneNumber,

                          @Nullable
                          String ranking) {
}
