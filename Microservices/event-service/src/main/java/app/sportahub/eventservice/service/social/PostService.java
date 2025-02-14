package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.model.social.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Post createPost(String eventId, PostRequest postRequest);

    Page<Post> getAllPostsOrderedByCreationDateInDesc(String eventId, Pageable pageable);
}
