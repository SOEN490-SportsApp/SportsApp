package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.CommentRequest;
import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.dto.response.social.CommentResponse;
import app.sportahub.eventservice.dto.response.social.PostResponse;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.exception.event.PostDoesNotExistException;
import app.sportahub.eventservice.mapper.social.CommentMapper;
import app.sportahub.eventservice.mapper.social.PostMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.social.Comment;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.repository.social.CommentRepository;
import app.sportahub.eventservice.repository.social.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostServiceImplTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CommentMapper commentMapper;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostMapper postMapper;

    @InjectMocks
    private PostServiceImpl postService;

    private PostRequest postRequest;
    private Post post;
    private Event event;
    private CommentRequest commentRequest;
    private Comment comment;

    @BeforeEach
    void setUp() {
        postRequest = new PostRequest("Content of the post", new ArrayList<>());
        post = Post.builder()
                .withId("post1")
                .withEventId("event1")
                .withCreatedBy("user1")
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        commentRequest = new CommentRequest("comment content", "user1");
        comment = Comment.builder()
                .withId("comment1")
                .withContent("comment content")
                .withCreatedBy("user1")
                .build();

        event = new Event();
        event.setId("event1");
        event.setPosts(new ArrayList<>(List.of(post)));
        post.setComments(new ArrayList<>(List.of(comment)));
    }

    @Test
    void testCreatePostShouldCreateAndReturnPost() {
        String eventId = "event1";

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user1");
        SecurityContextHolder.setContext(securityContext);

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(postMapper.postRequestToPost(postRequest)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse createdPost = postService.createPost(eventId, postRequest);

        verify(eventRepository).findEventById(eventId);
        verify(postMapper).postRequestToPost(postRequest);
        verify(postRepository).save(any(Post.class));

        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());

        Post capturedPost = postCaptor.getValue();

        assertThat(capturedPost.getEventId()).isEqualTo(eventId);
        assertThat(capturedPost.getCreationDate()).isNotNull();
        assertThat(capturedPost.getUpdatedAt()).isNotNull();
        assertThat(createdPost).isEqualTo(postMapper.postToPostResponse(post));
    }

    @Test
    void testCreatePostWhenEventDoesNotExistShouldThrowException() {
        String eventId = "1";

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.createPost(eventId, postRequest))
                .isInstanceOf(EventDoesNotExistException.class)
                .hasMessageContaining(eventId);

        verify(eventRepository).findEventById(eventId);
        verify(postMapper, never()).postRequestToPost(any(PostRequest.class));
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void createPost_WhenEventNotFound_ShouldThrowException() {
        String eventId = "nonexistent";

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.createPost(eventId, postRequest))
                .isInstanceOf(EventDoesNotExistException.class)
                .hasMessageContaining(eventId);
    }

    @Test
    void getAllPostsOrderedByCreationDateInDesc_ShouldReturnSortedPosts() {
        String eventId = "event1";
        Pageable pageable = PageRequest.of(0, 10);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        Page<PostResponse> result = postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable);

        verify(eventRepository).findById(eventId);
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst()).isEqualTo(postMapper.postToPostResponse(post));
    }

    @Test
    void getAllPostsOrderedByCreationDateInDesc_WhenEventNotFound_ShouldThrowException() {
        String eventId = "nonexistent";
        Pageable pageable = PageRequest.of(0, 10);

        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable))
                .isInstanceOf(EventDoesNotExistException.class)
                .hasMessageContaining(eventId);
    }

    @Test
    void getPost_ShouldReturnPost() {
        String eventId = "event1";
        String postId = "post1";
        PostResponse expectedResponse = new PostResponse("post1", "content", null, null, null);

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(postMapper.postToPostResponse(post)).thenReturn(expectedResponse);

        PostResponse result = postService.getPost(eventId, postId);

        verify(eventRepository).findEventById(eventId);
        verify(postMapper).postToPostResponse(post);
        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    void getPost_WhenPostNotFound_ShouldThrowException() {
        String eventId = "event1";
        String postId = "nonexistent";

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));

        assertThatThrownBy(() -> postService.getPost(eventId, postId))
                .isInstanceOf(PostDoesNotExistException.class)
                .hasMessageContaining(postId);
    }

    @Test
    void deletePost_ShouldRemovePost() {
        String eventId = "event1";
        String postId = "post1";
        PostResponse expectedResponse = new PostResponse("post1", "content", null, null, null);

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(postMapper.postToPostResponse(post)).thenReturn(expectedResponse);

        PostResponse result = postService.deletePost(eventId, postId);

        verify(eventRepository).findEventById(eventId);
        verify(postRepository).deleteById(postId);
        verify(eventRepository).save(event);
        verify(postMapper).postToPostResponse(post);

        assertThat(result).isEqualTo(expectedResponse);
        assertThat(event.getPosts()).doesNotContain(post);
    }

    @Test
    void createComment_ShouldAddCommentToPost() {
        String eventId = "event1";
        String postId = "post1";
        CommentResponse expectedResponse = new CommentResponse("comment1", "content", "user1", null);

        Authentication auth = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("user1");
        SecurityContextHolder.setContext(securityContext);

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(commentMapper.commentRequestToComment(commentRequest)).thenReturn(comment);
        when(commentMapper.commentToCommentResponse(comment, eventId, postId))
                .thenReturn(expectedResponse);
        when(commentRepository.save(comment)).thenReturn(comment);

        CommentResponse result = postService.createComment(eventId, postId, commentRequest);

        verify(eventRepository).findEventById(eventId);
        verify(commentMapper).commentRequestToComment(commentRequest);
        verify(commentRepository).save(comment);
        verify(postRepository).save(post);
        verify(eventRepository).save(event);

        assertThat(result).isEqualTo(expectedResponse);
        assertThat(post.getComments()).contains(comment);
    }

    @Test
    void deleteComment_ShouldRemoveComment() {
        String eventId = "event1";
        String postId = "post1";
        String commentId = "comment1";
        CommentResponse expectedResponse = new CommentResponse("comment1", "content", "user1", null);

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(commentMapper.commentToCommentResponse(comment, eventId, postId))
                .thenReturn(expectedResponse);

        CommentResponse result = postService.deleteComment(eventId, postId, commentId);

        verify(eventRepository).findEventById(eventId);
        verify(commentRepository).deleteById(commentId);
        verify(postRepository).save(post);
        verify(eventRepository).save(event);

        assertThat(result).isEqualTo(expectedResponse);
        assertThat(post.getComments()).doesNotContain(comment);
    }
}
