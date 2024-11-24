package app.sportahub.userservice.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SendVerificationEmailRequest(@Email String email) {
}
