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
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        event.getPosts().add(post);

        postRepository.save(post);
        eventRepository.save(event);
        log.info("Creating a new post for eventId: {} with the provided details: {}", eventId, postRequest);
        return post;
    }
}
