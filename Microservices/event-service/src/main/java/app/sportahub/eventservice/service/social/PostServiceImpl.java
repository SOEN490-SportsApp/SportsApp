package app.sportahub.eventservice.service.social;

import app.sportahub.eventservice.dto.request.social.CommentRequest;
import app.sportahub.eventservice.dto.request.social.PostRequest;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.dto.response.social.CommentResponse;
import app.sportahub.eventservice.dto.response.social.PostResponse;
import app.sportahub.eventservice.exception.event.*;
import app.sportahub.eventservice.mapper.social.CommentMapper;
import app.sportahub.eventservice.mapper.social.PostMapper;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.reactor.Reaction;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.model.social.Comment;
import app.sportahub.eventservice.model.social.Post;
import app.sportahub.eventservice.repository.event.EventRepository;
import app.sportahub.eventservice.repository.social.CommentRepository;
import app.sportahub.eventservice.repository.social.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final EventRepository eventRepository;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;
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
    public PostResponse createPost(String eventId, PostRequest postRequest) {
        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post post = postMapper.postRequestToPost(postRequest)
                .toBuilder()
                .withEventId(eventId)
                .withCreatedBy(authentication.getName())
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        event.getPosts().add(post);

        postRepository.save(post);
        eventRepository.save(event);
        log.info("Creating a new post for eventId: {} with the provided details: {}", eventId, postRequest);

        return postMapper.postToPostResponse(post);
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
    public Page<PostResponse> getAllPostsOrderedByCreationDateInDesc(String eventId, Pageable pageable) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventDoesNotExistException(eventId));

        List<PostResponse> sortedPosts = event.getPosts().stream()
                .sorted(Comparator.comparing(Post::getCreationDate).reversed())
                .map(postMapper::postToPostResponse)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sortedPosts.size());

        log.info("Retrieved all posts in event with Id: {}", eventId);

        return new PageImpl<>(
                sortedPosts.subList(start, end),
                pageable,
                sortedPosts.size()
        );
    }

    /**
     * Retrieves a specific post from an event.
     *
     * @param eventId the ID of the event containing the post
     * @param postId the ID of the post to retrieve
     * @return PostResponse containing the post data
     * @throws EventDoesNotExistException if no event exists with the given eventId
     * @throws PostDoesNotExistException if no post exists with the given postId in the specified event
     */
    @Override
    public PostResponse getPost(String eventId, String postId){

        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Post post = event.getPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new PostDoesNotExistException(postId, eventId));

        log.info("Retrieved post with Id: {} in event with Id: {}", postId, eventId);
        return  postMapper.postToPostResponse(post);
    }

    /**
     * Deletes a post from an event and returns the deleted post data.
     * This operation is transactional and will remove the post from both the event's post list
     * and the post repository.
     *
     * @param eventId the ID of the event containing the post to delete
     * @param postId the ID of the post to delete
     * @return PostResponse containing the deleted post data
     * @throws EventDoesNotExistException if no event exists with the given eventId
     * @throws PostDoesNotExistException if no post exists with the given postId in the specified event
     */
    @Transactional
    @Override
    public PostResponse deletePost(String eventId, String postId){
        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Post postToDelete = event.getPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new PostDoesNotExistException(postId, eventId));

        event.getPosts().remove(postToDelete);

        postRepository.deleteById(postToDelete.getId());
        eventRepository.save(event);

        log.info("Deleted post with Id: {} in event with Id: {}", postId, eventId);
        return  postMapper.postToPostResponse(postToDelete);
    }

    /**
     * Creates a new comment on a post within an event.
     * This operation is transactional and associates the comment with the authenticated user.
     *
     * @param eventId the ID of the event containing the post
     * @param postId the ID of the post to comment on
     * @param commentRequest the request object containing comment details
     * @return CommentResponse containing the created comment data
     * @throws EventDoesNotExistException if no event exists with the given eventId
     * @throws PostDoesNotExistException if no post exists with the given postId in the specified event
     * @throws IllegalStateException if no authentication context is available
     */
    @Transactional
    @Override
    public CommentResponse createComment(String eventId, String postId, CommentRequest commentRequest){

        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post post = event.getPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new PostDoesNotExistException(postId, eventId));

        String commentCreator = commentRequest.createdBy();
        String commentContent = commentRequest.content();
        new Comment(commentCreator, commentContent);
        Comment comment =  commentMapper.commentRequestToComment(commentRequest)
                .toBuilder()
                .withCreatedBy(commentCreator)
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withContent(commentContent)
                .withCreatedBy(authentication.getName())
                .build();

        post.getComments().add(comment);

        commentRepository.save(comment);
        eventRepository.save(event);
        postRepository.save(post);

        log.info("Created comment to post with Id: {} in event with Id: {}", postId, eventId);
        return commentMapper.commentToCommentResponse(comment, eventId, postId);
    }

    /**
     * Deletes a comment from a post within an event.
     * This operation is transactional and removes the comment from both the post's comment list
     * and the comment repository.
     *
     * @param eventId the ID of the event containing the post
     * @param postId the ID of the post containing the comment
     * @param commentId the ID of the comment to delete
     * @return CommentResponse containing the deleted comment data
     * @throws EventDoesNotExistException if no event exists with the given eventId
     * @throws PostDoesNotExistException if no post exists with the given postId in the specified event
     * @throws CommentDoesNotExistException if no comment exists with the given commentId on the specified post
     */
    @Transactional
    @Override
    public CommentResponse deleteComment(String eventId, String postId, String commentId){

        Event event = eventRepository.findEventById(eventId).orElseThrow(() -> new EventDoesNotExistException(eventId));

        Post post = event.getPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new PostDoesNotExistException(postId, eventId));

        Comment commentToDelete = post.getComments().stream()
                .filter(comment -> comment.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new CommentDoesNotExistException(commentId, postId, eventId));

        post.getComments().removeIf(comment -> comment.getId().equals(commentId));

        postRepository.save(post);
        commentRepository.deleteById(commentToDelete.getId());
        eventRepository.save(event);

        log.info("Deleted comment with Id: {} in post with Id: {}in event with Id: {}", commentId, postId, eventId);

        return commentMapper.commentToCommentResponse(commentToDelete, eventId, postId);
    }

    @Override
    public ReactionResponse reactToPost(String eventId, String postId, ReactionType newReaction){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        if(!(newReaction == ReactionType.NO_REACTION || newReaction == ReactionType.LIKE)){
            throw new InvalidReactionException();
        }

        Event event = eventRepository.findEventById(eventId)
                .orElseThrow(() -> new EventDoesNotExistException(eventId));

        Post post = event.getPosts().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow(() -> new PostDoesNotExistException(postId, eventId));

        Optional<Reaction> reactorToEventOpt = post.getReactions()
                .stream()
                .filter(reaction -> reaction.getUserId().equals(userId))
                .findFirst();

        Reaction reaction = new Reaction();

        if(reactorToEventOpt.isPresent()) {
            Reaction reactorToEvent = reactorToEventOpt.get();

            if (newReaction == ReactionType.NO_REACTION) {
                reaction = Reaction.builder()
                        .withUserId(userId)
                        .withReactionType(ReactionType.NO_REACTION)
                        .build();
                post.getReactions().remove(reactorToEvent);
            } else {
                throw new ReactionAlreadySubmittedException("post", postId, userId);
            }
        } else {
            if(newReaction == ReactionType.LIKE) {
                reaction = Reaction.builder()
                        .withUserId(userId)
                        .withReactionType(ReactionType.LIKE)
                        .build();
                post.getReactions().add(reaction);
            } else{
                throw new ReactionAlreadySubmittedException("post", postId, userId);
            }
        }
        postRepository.save(post);
        eventRepository.save(event);
        log.info("PostServiceImpl::reactToPost: Post with id: {} reaction: {}", eventId, newReaction);
        return new ReactionResponse( reaction.getUserId(), reaction.getReactionType());
    }
}
