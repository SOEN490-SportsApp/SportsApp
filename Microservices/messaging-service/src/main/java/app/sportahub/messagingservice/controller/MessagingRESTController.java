package app.sportahub.messagingservice.controller;

import app.sportahub.messagingservice.dto.request.message.MessageRequest;
import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.model.Member;
import app.sportahub.messagingservice.service.MessagingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/messaging")
@RequiredArgsConstructor
@Tag(name = "Messaging REST Management", description = "REST operations related to messaging")
public class MessagingRESTController {

    private final MessagingService messagingService;

    @GetMapping("/chatroom/{chatroomId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve a chatroom",
    description = "Retrieve a chatroom based on the passed chatroomId")
    public ChatroomResponse getChatroom(@PathVariable String chatroomId) {
        return messagingService.getChatroom(chatroomId);
    }

    @PatchMapping("/chatroom/{chatroomId}")
    @PreAuthorize("@messagingServiceImpl.isChatroomCreator(#chatroomId, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Partially update an existing chatroom",
    description = "Updates only the specified fields. Fields not included in the request body remain unchanged")
    public ChatroomResponse patchChatroom(@PathVariable String chatroomId,
                                          @RequestBody @Valid ChatroomRequest chatroomRequest) {
        return messagingService.patchChatroom(chatroomId, chatroomRequest);
    }

    @DeleteMapping("/chatroom/{chatroomId}")
    @PreAuthorize("@messagingServiceImpl.isChatroomCreator(#chatroomId, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Deletes a chatroom",
    description = "Deletes a chatroom from the database based on the provided chatroomId.")
    public void deleteChatroom(@PathVariable String chatroomId) {
        messagingService.deleteChatroom(chatroomId);
    }

    @GetMapping("/chatrooms/{userId}")
    @PreAuthorize("authentication.name == #userId || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve a user's chatrooms",
            description = "Retrieves all the chatrooms for which the given user is a member.")
    public List<ChatroomResponse> getChatrooms(@PathVariable("userId") String userId) {
        return messagingService.getChatrooms(userId);
    }

    @PostMapping("/chatroom")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new chatroom",
            description = "Creates a new chatroom and populates the members.")
    public ChatroomResponse createChatroom(@Valid @RequestBody ChatroomRequest chatroomRequest) {
        return messagingService.createChatroom(chatroomRequest);
    }

    @GetMapping("/chatrooms/messages/{chatroomId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve a chatroom's messages",
            description = "Retrieves messages sent in a chatroom")
    public List<MessageResponse> getMessages(@PathVariable("chatroomId") String chatroomId) {
        return messagingService.getMessages(chatroomId);
    }

    @PatchMapping("/chatroom/message/{messageId}")
    @PreAuthorize("@messagingServiceImpl.isMessageCreator(#messageId, authentication.name || hasRole('ROLE_ADMIN'))")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Partially updates an existing message",
    description = "Updates only the specified fields. Fields not included in the request remain unchanged.")
    public MessageResponse patchMessage(@PathVariable("messageId") String messageId,
                                        @RequestBody @Valid MessageRequest messageRequest ) {
        return messagingService.patchMessage(messageId, messageRequest);
    }

    @DeleteMapping("/chatroom/message/{messageId}")
    @PreAuthorize("@messagingServiceImpl.isMessageCreator(#messageId, authentication.name || hasRole('ROLE_ADMIN'))")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Deletes a message",
    description = " Deletes a message from the database based on the provided messageId.")
    public void deleteMessage(@PathVariable("messageId") String messageId) {
        messagingService.deleteMessage(messageId);
    }

    @PostMapping("/chatroom/add-members/{chatroomId}")
    @PreAuthorize("@messagingServiceImpl.isChatroomCreator(#chatroomId, authentication.name || hasRole('ROLE_ADMIN'))")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "adds new members to a chatroom",
    description = " Adds members to an existing chatroom based on the provided chatroomId and userIds")
    public ChatroomResponse addMembers(@PathVariable("chatroomId") String chatroomId, @RequestBody List<Member> members) {
        return messagingService.addMembers(chatroomId, members);
    }

    @PostMapping("/chatroom/remove-members/{chatroomId}")
    @PreAuthorize("@messagingServiceImpl.isChatroomCreator(#chatroomId, authentication.name || hasRole('ROLE_ADMIN'))")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Allows the chatroom creator to remove members from the chatroom",
    description = "Allows the chatroom creator to remove members from an existing chatroom based on the provided " +
            "chatroomId and userIds")
    public ChatroomResponse removeMembers(@PathVariable("chatroomId") String chatroomId,
                                          @RequestBody List<Member> members ) {
        return messagingService.removeMembers(chatroomId, members);
    }

    @PostMapping("/chatroom/leave-chatroom/{chatroomId}/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Removes the user from the chatroom members set",
    description = "Removes the user from the chatroom members set if they are not the creator of the chatroom.")
    public ChatroomResponse leaveChatroom(@PathVariable("chatroomId") String chatroomId,
                                          @PathVariable("userId") String userId) {
        return messagingService.leaveChatroom(chatroomId, userId);
    }
}