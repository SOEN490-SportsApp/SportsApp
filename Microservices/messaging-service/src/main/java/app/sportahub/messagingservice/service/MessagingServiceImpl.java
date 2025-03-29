package app.sportahub.messagingservice.service;

import app.sportahub.messagingservice.dto.request.message.MessageRequest;
import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.exception.*;
import app.sportahub.messagingservice.mapper.ChatroomMapper;
import app.sportahub.messagingservice.mapper.MessageMapper;
import app.sportahub.messagingservice.model.Chatroom;
import app.sportahub.messagingservice.model.Member;
import app.sportahub.messagingservice.model.Message;
import app.sportahub.messagingservice.repository.ChatroomRepository;
import app.sportahub.messagingservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessagingServiceImpl  implements MessagingService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatroomRepository chatroomRepository;
    private final ChatroomMapper chatroomMapper;
    private final MessageMapper messageMapper;


    /**
     * This method is how the backend routes the messages it receives from the /app/message websocket endpoint
     * to the appropriate topic following this format: 'topic/chatroom/{chatroomId}, based off the chatroom id of the message.
     *
     * @param messageRequest the message that was received from a user through a websocket connection.
     * @throws ChatroomDoesNotExistException if no chatroom with the specified chatroom id is found
     */
    @Override
    public void processMessage(MessageRequest messageRequest) {
        Message message = messageMapper.messageRequestToMessage(messageRequest)
                .toBuilder()
                .withCreatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();
        String chatroomId;

        chatroomId = message.getChatroomId();

        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId).orElseThrow(() ->
                new ChatroomDoesNotExistException(chatroomId));

        Message savedMessage = messageRepository.save(message);
        List<Message> messages = chatroom.getMessages();
        messages.addFirst(savedMessage);
        chatroom.setMessages(messages);
        chatroomRepository.save(chatroom);
        messagingTemplate.convertAndSend("/topic/chatroom/" + chatroomId, savedMessage);
    }

    /**
     * This method will retrieve all the messages stored within the chatroom associated with the specified chatroomId
     *
     * @param chatroomId the unique identifier representing the chatroom who's messages we want to retrieve
     * @return a list of {@link MessageResponse} objects representing the messages found within the chatroom object
     * @throws ChatroomDoesNotExistException if no chatroom object with the specified id was found
     */
    @Override
    public List<MessageResponse> getMessages(String chatroomId) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId).orElseThrow(() ->
                new ChatroomDoesNotExistException(chatroomId));

        List<Message> messages = chatroom.getMessages();

        return messages.stream()
                .map(messageMapper::MessageToMessageResponse).toList();
    }

    /**
     * This method returns all chatrooms for which the specified user is a member
     *
     * @param userId the unique identifier of the user who's chatrooms we want to retrieve
     * @return a list of {@link ChatroomResponse} objects representing the chatrooms that the user is a member of.
     * Can be empty if the user is not part of any chatrooms.
     */
    @Override
    public List<ChatroomResponse> getChatrooms(String userId) {
        List<Chatroom> chatrooms = chatroomRepository.findAllByMembers_UserId(userId);

        return chatrooms.stream()
                .map(chatroomMapper::chatroomToChatroomResponse)
                .toList();
    }

    /**
     * This method will create a new chatroom based off the data that is passed in the chatroomRequest
     *
     * @param chatroomRequest the object containing all the data necessary to create the new chatroom.
     * @return a {@link ChatroomResponse} object representing the newly created chatroom object
     * @throws ChatroomAlreadyExistsException if a chatroom with the same name, members, and creator already exists
     */
    @Override
    public ChatroomResponse createChatroom(ChatroomRequest chatroomRequest) {
        Chatroom newChatroom = chatroomMapper.chatroomRequestToChatroom(chatroomRequest);

        if (chatroomRepository.findByCreatedByAndChatroomNameAndMembersEquals(newChatroom.getCreatedBy(),
                newChatroom.getChatroomName(), newChatroom.getMembers()).isPresent()) {
            throw new ChatroomAlreadyExistsException(newChatroom.getCreatedBy(), newChatroom.getChatroomName());
        }

        Set<Member> members = newChatroom.getMembers();

        if (members.stream().noneMatch(member -> member.getUserId().equals(chatroomRequest.createdBy()))) {
            throw new ChatroomCreatorMustBeAMemberException(chatroomRequest.createdBy());
        }

        if (members.size() == 2) {
            Optional<Chatroom> existing1on1 = chatroomRepository.findByMembersEquals(members);
            if (existing1on1.isPresent()) {
                return chatroomMapper.chatroomToChatroomResponse(existing1on1.get());
            }
        }

        newChatroom.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        Chatroom savedChatroom = chatroomRepository.save(newChatroom);
        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }

    /**
     * Retrieves a chatroom object from the database based on the specified chatroomId
     *
     * @param chatroomId the unique identifier for the chatroom we are trying to find
     * @return a {@link ChatroomResponse} object representing the chatroom that was found
     * @throws ChatroomDoesNotExistException if no chatroom was found with the specified chatroomId
     */
    @Override
    public ChatroomResponse getChatroom(String chatroomId) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId).orElseThrow(() -> new
                ChatroomDoesNotExistException(chatroomId));
        return chatroomMapper.chatroomToChatroomResponse(chatroom);
    }


    /**
     * Partially updates an existing chatroom with the specified chatroomId. This method updates only the fields
     * provided in the {@link ChatroomRequest}, leaving all other fields unchanged.
     *
     * @param chatroomId the unique identifier of the chatroom to patch
     * @param chatroomRequest the partial data to update the message with
     * @return a {@link ChatroomResponse} object representing the patched chatroom
     * @throws ChatroomDoesNotExistException if no chatroom with the specified id is found
     */
    @Override
    public ChatroomResponse patchChatroom(String chatroomId, ChatroomRequest chatroomRequest) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId)
                .orElseThrow(() -> new ChatroomDoesNotExistException(chatroomId));

        chatroomMapper.patchChatroomFromRequest(chatroomRequest, chatroom);
        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        log.info("patchChatroom: Chatroom with id: {} was successfully patched", savedChatroom.getChatroomId());
        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }


    /**
     * Deletes a chatroom from the database using the chatroom id
     *
     * @param chatroomId The id of the chatroom to be deleted
     * @throws ChatroomDoesNotExistException if there is no chatroom associated with the provided id
     */
    @Override
    public void deleteChatroom(String chatroomId) {

        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId).orElseThrow(() ->
                new ChatroomDoesNotExistException(chatroomId));
        chatroomRepository.delete(chatroom);
        log.info("deleteChatroom: Chatroom with id: {} was successfully deleted", chatroomId);
    }

    /**
     * Partially updates an existing message with the specified messageId. This method updates only
     * the fields provided in the {@link MessageRequest}, leaving all other fields unchanged.
     * It will also modify and save the messages list in the related chatroom Object.
     *
     * @param messageId the unique identifier of the message to patch
     * @param messageRequest the partial data to update the message with
     * @return a {@link MessageResponse} object representing the patched message
     * @throws MessageDoesNotExistException if no message with the specified id is found
     */
    @Override
    @Transactional
    public MessageResponse patchMessage(String messageId, MessageRequest messageRequest) {
        Message message = messageRepository.findByMessageId(messageId)
                .orElseThrow(() -> new MessageDoesNotExistException(messageId));

        messageMapper.patchMessageFromRequest(messageRequest, message);
        Message savedMessage = messageRepository.save(message);
        log.info("patchMessage: Message with id: {} was successfully patched", savedMessage.getMessageId());

        Optional<Chatroom> chatroom = chatroomRepository.findByChatroomId(message.getChatroomId());
        chatroom.ifPresent(cr -> {
            List<Message> chatroomMessages = cr.getMessages();
            chatroomMessages = chatroomMessages.stream()
                    .peek(m -> {
                        if (m.getMessageId().equals(savedMessage.getMessageId())) {
                            messageMapper.patchMessageFromRequest(messageRequest, m);
                            log.info("patchMessage: Message with id: {} was successfully found in the chatroom with id: {}",
                                    m.getMessageId(), cr.getChatroomId());
                        }
                    })
                    .collect(Collectors.toList());
            cr.setMessages(chatroomMessages);
            Chatroom savedChatroom = chatroomRepository.save(cr);
            log.info("patchMessage: Chatroom with id: {} was successfully updated", savedChatroom.getChatroomId());
        });
        return messageMapper.MessageToMessageResponse(savedMessage);
    }


    /**
     * Deletes a message from the database using the message id and updates the related chatroom
     *
     * @param messageId The id of the message to be deleted
     * @throws MessageDoesNotExistException if there is no message associated with the provided id
     */
    @Override
    @Transactional
    public void deleteMessage(String messageId) {

        Message message = messageRepository.findByMessageId(messageId).orElseThrow(() ->
                new MessageDoesNotExistException(messageId));
        messageRepository.delete(message);
        log.info("deleteMessage: Message with id: {} was successfully deleted", messageId);

        Optional<Chatroom> chatroom = chatroomRepository.findByChatroomId(message.getChatroomId());
        chatroom.ifPresent(cr -> {
            List<Message> chatroomMessages = cr.getMessages();
            chatroomMessages.remove(message);
            cr.setMessages(chatroomMessages);
            chatroomRepository.save(cr);
            log.info("deleteMessage: Message with id: {} was successfully removed from chatroom with id: {}",
                    messageId, cr.getChatroomId());
        });
    }

    /**
     * This method adds the list of passed userIds to a chatroom based on the specified chatroomId.
     * This method will convert the passed list into a set, removing duplicates and allowing for set operations
     *
     * @param chatroomId the unique identifier of the chatroom who's members you want to modify
     * @param newMembers the unique identifiers of the users you want to remove from the chatroom
     * @return a {@link ChatroomResponse} object representing the newly modified chatroom object
     * @throws ChatroomDoesNotExistException if no chatroom is found with the specified chatroomId
     */
    @Override
    public ChatroomResponse addMembers(String chatroomId, List<Member> newMembers) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId)
                .orElseThrow(() -> new ChatroomDoesNotExistException(chatroomId));

        Set<Member> memberSet = new HashSet<>(newMembers);
        memberSet.addAll(chatroom.getMembers());
        chatroom.setMembers(memberSet);
        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        log.info("MessagingServiceImpl::addMembers: Successfully added new members to the chatroom with id: {}",
                savedChatroom.getChatroomId());
        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }

    /**
     * This method allows the chatroom's creator to remove the list of passed userIds from a chatroom based on the
     * specified chatroomId.
     * This method will convert the passed list into a set, removing duplicates and allowing for set operations.
     *
     * @param chatroomId the unique identifier of the chatroom who's members you want to modify
     * @param members    the unique identifiers of the users you want to remove from the chatroom
     * @return a {@link ChatroomResponse} object representing the newly modified chatroom object
     * @throws ChatroomDoesNotExistException if no chatroom is found with the specified chatroomId
     * @throws ChatroomCreatorTryingToRemoveThemselvesFromChatroomException if the creator's userId is in userIds
     */
    @Override
    public ChatroomResponse removeMembers(String chatroomId, List<Member> members) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId)
                .orElseThrow(() -> new ChatroomDoesNotExistException(chatroomId));

        Set<Member> paramMembers = new HashSet<>(members);
        Set<Member> existingMembers = chatroom.getMembers();

        if (paramMembers.contains(chatroom.getCreatedBy()))
            throw new ChatroomCreatorTryingToRemoveThemselvesFromChatroomException(chatroomId, chatroom.getCreatedBy());

        existingMembers.removeAll(paramMembers);
        chatroom.setMembers(existingMembers);
        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        log.info("MessagingServiceImpl::removeMembers: Successfully removed members from the chatroom with id: {}",
                savedChatroom.getChatroomId());

        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }

    /**
     * This method allows a user who is member of a chatroom they did not create remove themselves from the chatroom.
     *
     * @param chatroomId the unique identifier of the chatroom
     * @param userId the unique identifier of the user
     * @return a {@link ChatroomResponse} object representing the newly modified chatroom object
     * @throws ChatroomDoesNotExistException if no chatroom is found with the specified chatroomId
     * @throws UserIsNotAChatroomMemberException if the provided userId is not in the chatroom's existing members set.
     * @throws ChatroomCreatorTryingToRemoveThemselvesFromChatroomException if the provided userId is the chatroom's creator.
     */
    @Override
    public ChatroomResponse leaveChatroom(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findByChatroomId(chatroomId)
                .orElseThrow(() -> new ChatroomDoesNotExistException(chatroomId));

        Set<Member> existingMembers = chatroom.getMembers();

        if(existingMembers.stream().noneMatch(m -> m.getUserId().equals(userId))) {
            throw new UserIsNotAChatroomMemberException(chatroomId, userId);
        }

        if(userId.equals(chatroom.getCreatedBy())) {
            throw new ChatroomCreatorTryingToRemoveThemselvesFromChatroomException(chatroomId, chatroom.getCreatedBy());
        }
        existingMembers.removeIf(m -> m.getUserId().equals(userId));
        chatroom.setMembers(existingMembers);
        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        log.info("MessagingServiceImpl::leaveChatroom: Successfully removed the user with id: {} " +
                "from the chatroom with id: {}.", userId, savedChatroom.getChatroomId());

        return chatroomMapper.chatroomToChatroomResponse(savedChatroom);
    }


    /**
     * Checks if the user with the specified userId is the creator of the chatroom with the specified id
     *
     * @param chatroomId the unique identifier of the chatroom
     * @param userId the unique identifier of the user
     * @return true if the user is the creator of the chatroom, false otherwise
     * @throws ChatroomDoesNotExistException if no chatroom with the specified ID is found
     */
    @Override
    public boolean isChatroomCreator(String chatroomId, String userId) {
        return chatroomRepository.findByChatroomId(chatroomId)
                .map(chatroom -> chatroom.getCreatedBy().equals(userId))
                .orElseThrow(() -> new ChatroomDoesNotExistException(chatroomId));
    }

    /**
     * Checks if the user with the specified userId is the creator of the message with the specified id
     *
     * @param messageId the unique identifier of the message
     * @param userId the unique identifier of the user
     * @return true if the user is the creator of the message, false otherwise
     * @throws MessageDoesNotExistException if no message with the specified ID is found
     */
    @Override
    public boolean isMessageCreator(String messageId, String userId) {
        return messageRepository.findByMessageId(messageId)
                .map(message -> message.getSenderId().equals(userId))
                .orElseThrow(() -> new MessageDoesNotExistException(messageId));
    }
}
