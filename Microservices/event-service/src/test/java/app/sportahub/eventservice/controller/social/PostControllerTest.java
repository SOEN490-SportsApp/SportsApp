package app.sportahub.eventservice.controller.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.service.social.PostService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostControllerTest {

    @Mock
    private PostService postService;

    @InjectMocks
    private PostController postController;

    @Mock
    private PostRequest postRequest;

    @Mock
    private Post post;

    @Test
    void testCreatePostShouldReturnCreatedPost() {
        String eventId = "1";
        when(postService.createPost(eq(eventId), any(PostRequest.class))).thenReturn(post);

        postController.createPost(eventId, postRequest);

        verify(postService, times(1)).createPost(eq(eventId), any(PostRequest.class));
    }

    @Test
    void testGetAllPostsOrderedByCreationDateInDescShouldReturnPostsPage() {
        String eventId = "1";
        Page<Post> page = new PageImpl<>(List.of(post));
        int pageNumber = 0;
        int pageSize = 10;

        when(postService.getAllPostsOrderedByCreationDateInDesc(eq(eventId), any(Pageable.class))).thenReturn(page);

        Page<Post> resultPage = postController.getAllPostsOrderedByCreationDateInDesc(eventId, pageNumber, pageSize);

        verify(postService, times(1)).getAllPostsOrderedByCreationDateInDesc(eq(eventId), any(Pageable.class));
    }
}
