package app.sportahub.eventservice.controller.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.service.social.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@Tag(name = "Post Management", description = "Operations related to post management. Allows users to create and retrieve posts associated with events.")
public class PostController {

    private final PostService postService;

    @PostMapping
    @PreAuthorize("@eventService.isParticipant(#eventId, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Creates a new post",
            description = "Creates a new post resource in the database associated with the event specified by the eventId. " +
                    "Only participants with a status of JOINED or CONFIRMED are allowed to create posts. " +
                    "Admins also have the privilege to create posts for any event.",
            parameters = {
                    @Parameter(name = "eventId", description = "Unique identifier of the event for which the post is being created", required = true, example = "12345")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Post successfully created", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden – User is not a participant or not authorized"),
            @ApiResponse(responseCode = "404", description = "Event or user not found")
    })
    public Post createPost(@PathVariable String eventId, @RequestBody PostRequest postRequest) {
        return postService.createPost(eventId, postRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
            summary = "Retrieve all posts of an event",
            description = "Fetches all posts associated with the specified event, ordered by the latest creation date. " +
                    "This operation is available to all users but will only show posts from events the user has access to.",
            parameters = {
                    @Parameter(name = "eventId", description = "Unique identifier of the event from which posts are retrieved", required = true, example = "12345"),
                    @Parameter(name = "page", description = "Page number for pagination", example = "0"),
                    @Parameter(name = "size", description = "Number of posts per page", example = "10")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of posts", content = @Content),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public Page<Post> getAllPostsOrderedByCreationDateInDesc(
            @PathVariable String eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return postService.getAllPostsOrderedByCreationDateInDesc(eventId, pageable);
    }
}
