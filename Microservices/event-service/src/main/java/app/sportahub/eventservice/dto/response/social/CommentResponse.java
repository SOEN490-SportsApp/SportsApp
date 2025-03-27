package app.sportahub.eventservice.dto.response.social;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CommentResponse(
        String eventId,
        String id,
        String postId,
        String content,
        String createdBy) {
}