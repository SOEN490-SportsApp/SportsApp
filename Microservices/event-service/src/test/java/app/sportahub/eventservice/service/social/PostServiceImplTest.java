package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.mapper.social.PostMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.repository.social.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.ArrayList;
import java.util.Collections;
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
    private PostMapper postMapper;

    @InjectMocks
    private PostServiceImpl postService;

    private PostRequest postRequest;
    private Post post;
    private Event event;

    @BeforeEach
    void setUp() {
        postRequest = new PostRequest("Content of the post", "8btr8h689hhr909h", new ArrayList<>());
        post = Post.builder().withEventId("1").build();
        event = new Event();
        event.setPosts(new ArrayList<>());
    }

    @Test
    void testCreatePostShouldCreateAndReturnPost() {
        String eventId = "1";

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(postMapper.postRequestToPost(postRequest)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);

        Post createdPost = postService.createPost(eventId, postRequest);

        verify(eventRepository).findEventById(eventId);
        verify(postMapper).postRequestToPost(postRequest);
        verify(postRepository).save(any(Post.class));

        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());

        Post capturedPost = postCaptor.getValue();

        assertThat(capturedPost.getEventId()).isEqualTo(eventId);
        assertThat(capturedPost.getCreationDate()).isNotNull();
        assertThat(capturedPost.getUpdatedAt()).isNotNull();
        assertThat(createdPost).isEqualTo(post);
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
    void testGetAllPostsOrderedByCreationDateInDescShouldReturnSortedPosts() {
        String eventId = "1";
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "creationDate"));
        Page<Post> mockPage = new PageImpl<>(List.of(post));

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.of(event));
        when(postRepository.findByEventId(eventId, pageable)).thenReturn(mockPage);

        Page<Post> resultPage = postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable);

        verify(eventRepository).findEventById(eventId);
        verify(postRepository).findByEventId(eventId, pageable);

        assertThat(resultPage).isEqualTo(mockPage);
    }

    @Test
    void testGetAllPostsOrderedByCreationDateInDescWhenEventDoesNotExistShouldThrowException() {
        String eventId = "1";
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "creationDate"));

        when(eventRepository.findEventById(eventId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable))
                .isInstanceOf(EventDoesNotExistException.class)
                .hasMessageContaining(eventId);

        verify(eventRepository).findEventById(eventId);
        verify(postRepository, never()).findByEventId(anyString(), any(Pageable.class));
    }
}
