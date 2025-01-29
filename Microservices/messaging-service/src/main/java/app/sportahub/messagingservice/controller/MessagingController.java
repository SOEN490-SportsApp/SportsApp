package app.sportahub.messagingservice.controller;

import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.model.Message;
import app.sportahub.messagingservice.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Controller
@RequestMapping("/messaging")
@RequiredArgsConstructor
@Tag(name = "Messaging Management", description = "Operations related to messaging")
public class MessagingController {

    private final MessagingService messagingService;

    @MessageMapping("/message")
    public void processMessage(@Payload Message message) {
        messagingService.processMessage(message);

    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve messages between two users",
    description = "Retrieves messages between two users based on the given path variables.")
    public List<MessageResponse> getMessages(@PathVariable("senderId") String senderId,
                                             @PathVariable("receiverId") String receiverId) {
        return messagingService.getMessages(senderId, receiverId);
    }
}
