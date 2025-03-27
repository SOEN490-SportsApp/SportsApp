package app.sportahub.eventservice.mapper.social;

import app.sportahub.eventservice.dto.request.social.CommentRequest;
import app.sportahub.eventservice.dto.response.social.CommentResponse;
import app.sportahub.eventservice.model.social.Comment;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment commentRequestToComment(CommentRequest commentRequest);

    CommentResponse commentToCommentResponse(Comment comment, String eventId, String postId);
}
