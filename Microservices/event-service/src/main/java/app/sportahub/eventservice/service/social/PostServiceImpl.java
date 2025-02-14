package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.mapper.social.PostMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.repository.social.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Slf4j
@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final EventRepository eventRepository;

    private final PostMapper postMapper;

    /**
     * Creates a new post associated with a specific event.
     * <p>
     * This method retrieves the event by its ID and throws an exception if the event does not exist.
     * It then maps the given {@code PostRequest} to a {@code Post} entity, associates it with the event,
     * and sets the update timestamps. The post is added to the event, and both entities are saved to
     * their respective repositories.
     * </p>
     *
     * @param eventId     The unique identifier of the event for which the post is being created.
     * @param postRequest The request object containing the details of the new post.
     * @return The created {@code Post} entity.
     * @throws EventDoesNotExistException if no event is found with the given {@code eventId}.
     */
    @Transactional
    @Override
    public Post createPost(String eventId, PostRequest postRequest) {
        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        //TODO: check if userid exists

        Post post = postMapper.postRequestToPost(postRequest)
                .toBuilder()
                .withEventId(eventId)
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        event.getPosts().add(post);

        postRepository.save(post);
        eventRepository.save(event);
        log.info("Creating a new post for eventId: {} with the provided details: {}", eventId, postRequest);
        return post;
    }

    /**
     * Retrieves a paginated list of posts associated with a specific event, ordered by creation date in descending order.
     * <p>
     * This method checks if the event exists by its ID and throws an exception if the event is not found.
     * It then retrieves the posts related to the event, pages and sorts them by the creation date in descending order.
     * The posts are returned encapsulated in a {@code Page} object representing one segment of the posts list.
     * </p>
     *
     * @param eventId  The unique identifier of the event whose posts are to be retrieved.
     * @param pageable The pagination information including page number and size requirements.
     * @return A {@code Page} object containing a list of {@code Post} entities ordered by creation date in descending order.
     * @throws EventDoesNotExistException if no event is found with the given {@code eventId}.
     */
    @Override
    public Page<Post> getAllPostsOrderedByCreationDateInDesc(String eventId, Pageable pageable) {
        eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "creationDate")
        );

        Page<Post> posts = postRepository.findByEventId(eventId, sortedPageable);
        return new PageImpl<>(posts.getContent(), posts.getPageable(), posts.getTotalElements());
    }
}
