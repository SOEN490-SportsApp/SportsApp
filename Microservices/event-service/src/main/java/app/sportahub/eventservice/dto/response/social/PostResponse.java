package app.sportahub.eventservice.dto.response.social;

import app.sportahub.eventservice.model.event.reactor.Reaction;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PostResponse(
        String eventId,
        String id,
        String content,
        String createdBy,
        List<String> attachments,
        List<CommentResponse> comments,
        List<Reaction> reactions) {
}
