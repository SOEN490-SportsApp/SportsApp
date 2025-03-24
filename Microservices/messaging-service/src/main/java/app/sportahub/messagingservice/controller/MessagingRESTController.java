package app.sportahub.messagingservice.controller;

import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.service.MessagingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
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


    @GetMapping("/chatrooms/messages/{chatroomId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve a chatroom's messages",
            description = "Retrieves messages sent in a chatroom")
    public List<MessageResponse> getMessages(@PathVariable("chatroomId") String chatroomId) {
        return messagingService.getMessages(chatroomId);
    }

    @GetMapping("/chatrooms/{userId}")
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
}