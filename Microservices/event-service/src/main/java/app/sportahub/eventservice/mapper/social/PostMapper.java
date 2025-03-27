package app.sportahub.eventservice.mapper.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.dto.response.social.PostResponse;
import app.sportahub.eventservice.model.social.Post;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface PostMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Post postRequestToPost(PostRequest postRequest);

    PostResponse postToPostResponse(Post post);
}
