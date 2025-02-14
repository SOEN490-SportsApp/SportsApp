package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.model.social.Post;

public interface PostService {
    Post createPost(String eventId, PostRequest postRequest);
}
