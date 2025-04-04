package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.CommentRequest;
import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.dto.response.social.CommentResponse;
import app.sportahub.eventservice.dto.response.social.PostResponse;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    PostResponse createPost(String eventId, PostRequest postRequest);

    Page<PostResponse> getAllPostsOrderedByCreationDateInDesc(String eventId, Pageable pageable);

    PostResponse getPost(String eventId, String postId);

    CommentResponse createComment(String eventId, String postId, CommentRequest commentRequest);

    CommentResponse deleteComment(String eventId, String postId, String commentId);

    PostResponse deletePost(String eventId, String postId);

    ReactionResponse reactToPost(String eventId, String postId, ReactionType reactionType);

    boolean isPostCreator(String eventId, String userId);

    boolean isCommentCreator(String eventId, String userId);
}
