package app.sportahub.eventservice.dto.request.social;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CommentRequest(
        @NotBlank(message = "Comment content must be provided")
        String content,

        @NotBlank(message = "Valid id of the user who created the comment must be provided")
        String createdBy){
}
