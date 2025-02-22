package app.sportahub.eventservice.dto.request.social;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PostRequest(
        @NotBlank(message = "Post content must be provided")
        String content,

        @Nullable
        List<String> attachments) {
}
