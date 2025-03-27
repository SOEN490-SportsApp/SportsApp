package app.sportahub.eventservice.dto.response.social;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PostResponse(
        String eventId,
        String content,
        String createdBy,
        List<String> attachments,
        List<CommentResponse> comments
) {
}
