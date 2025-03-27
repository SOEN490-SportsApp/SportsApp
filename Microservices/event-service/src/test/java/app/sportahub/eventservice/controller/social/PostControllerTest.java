package app.sportahub.eventservice.controller.social;

import app.sportahub.eventservice.dto.request.social.CommentRequest;
import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.dto.response.social.CommentResponse;
import app.sportahub.eventservice.dto.response.social.PostResponse;
import app.sportahub.eventservice.mapper.social.PostMapper;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.service.event.EventService;
import app.sportahub.eventservice.service.social.PostService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostControllerTest {

    @Mock
    private PostService postService;

    @Mock
    private EventService eventService;

    @Mock
    private PostMapper postMapper;

    @InjectMocks
    private PostController postController;

    @Mock
    private PostRequest postRequest;

    @Mock
    private Post post;

    private ReactionResponse reactionResponse;
    private final String eventId = "event1";
    private final String postId = "post1";
    private final String commentId = "comment1";
    private final String username = "testUser";

    @Test
    void testCreatePostShouldReturnCreatedPost() {
        String eventId = "1";

        PostResponse returnedPost = postMapper.postToPostResponse(post);

        when(postService.createPost(eq(eventId), any(PostRequest.class))).thenReturn(returnedPost);

        postController.createPost(eventId, postRequest);

        verify(postService, times(1)).createPost(eq(eventId), any(PostRequest.class));
    }

    @Test
    void testGetAllPostsOrderedByCreationDateInDescShouldReturnPostsPage() {
        // Setup
        String eventId = "1";
        int pageNumber = 0;
        int pageSize = 10;

        PostResponse returnedPost = new PostResponse(
                "event1",
                "post1",
                "Test content",
                "user1",
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>()
        );

        Page<PostResponse> page = new PageImpl<>(
                List.of(returnedPost),
                PageRequest.of(pageNumber, pageSize),
                1
        );

        when(postService.getAllPostsOrderedByCreationDateInDesc(eq(eventId), any(Pageable.class)))
                .thenReturn(page);

        // Execute
        Page<PostResponse> result = postController.getAllPostsOrderedByCreationDateInDesc(
                eventId,
                pageNumber,
                pageSize
        );

        // Verify
        verify(postService, times(1))
                .getAllPostsOrderedByCreationDateInDesc(eq(eventId), any(Pageable.class));

        assertThat(result).isNotNull();
        assertThat(result.getContent().getFirst()).isEqualTo(returnedPost);
    }


    @Test
    @WithMockUser
    void getPost_ShouldReturnPostResponse() {
        PostResponse expectedResponse = new PostResponse(postId, null, "content", null, null, null, null);

        when(postService.getPost(eventId, postId)).thenReturn(expectedResponse);

        PostResponse result = postController.getPost(eventId, postId);

        verify(postService).getPost(eventId, postId);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    @WithMockUser
    void deletePost_ShouldReturnPostResponse() {
        PostResponse expectedResponse = new PostResponse(postId,  null,"content", null, null, null, null);

        when(postService.deletePost(eventId, postId)).thenReturn(expectedResponse);

        PostResponse result = postController.deletePost(eventId, postId);

        verify(postService).deletePost(eventId, postId);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deletePost_AsAdmin_ShouldSucceed() {
        PostResponse expectedResponse = new PostResponse(postId, null, "content", null, null, null, null);

        when(postService.deletePost(eventId, postId)).thenReturn(expectedResponse);

        PostResponse result = postController.deletePost(eventId, postId);

        verify(postService).deletePost(eventId, postId);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    @WithMockUser
    void createComment_ShouldReturnCommentResponse() {
        CommentRequest request = new CommentRequest("Test comment", username);
        CommentResponse expectedResponse = new CommentResponse(commentId, null,"Test comment", username, null);

        when(postService.createComment(eventId, postId, request)).thenReturn(expectedResponse);

        CommentResponse result = postController.createComment(eventId, postId, request);

        verify(postService).createComment(eventId, postId, request);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    @WithMockUser
    void deleteComment_ShouldReturnCommentResponse() {
        CommentResponse expectedResponse = new CommentResponse(commentId, null,"Test comment", username, null);

        when(postService.deleteComment(eventId, postId, commentId)).thenReturn(expectedResponse);

        CommentResponse result = postController.deleteComment(eventId, postId, commentId);

        verify(postService).deleteComment(eventId, postId, commentId);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    public void testReactToEvent() {
        Mockito.when(postService.reactToPost(Mockito.eq("testId"), Mockito.eq("postId"), Mockito.eq(ReactionType.LIKE)))
                .thenReturn(reactionResponse);

        ReactionResponse response = postController.reactToPost("testId", "postId", ReactionType.LIKE);

        assertEquals(reactionResponse, response);
        Mockito.verify(postService).reactToPost(Mockito.eq("testId"), Mockito.eq("postId"), Mockito.eq(ReactionType.LIKE));
    }
}
