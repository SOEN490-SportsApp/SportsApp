package app.sportahub.eventservice.controller.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.service.social.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/event/{eventId}/social/post")
@RequiredArgsConstructor
@Tag(name = "Post Management", description = "Operations related to post management")
public class PostController {

    private final PostService postService;

    @PostMapping
    @PreAuthorize("@eventService.isParticipant(#eventId, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new post",
            description = "Creates a new post resource to the database based on the provided post details.")
    public Post createPost(@PathVariable String eventId, @RequestBody PostRequest postRequest) {
        return postService.createPost(eventId, postRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve all posts of an event",
            description = "Fetches all posts associated with the specified event in order of latest creation.")
    public Page<Post> getAllPostsOrderedByCreationDateInDesc(
            @PathVariable String eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable);
    }
}
