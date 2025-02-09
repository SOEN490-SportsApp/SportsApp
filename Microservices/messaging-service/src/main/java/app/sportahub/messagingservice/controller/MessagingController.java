package app.sportahub.messagingservice.controller;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
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
@ResponseBody
@Tag(name = "Messaging Management", description = "Operations related to messaging")
public class MessagingController {

    private final MessagingService messagingService;

    @MessageMapping("/message")
    public void processMessage(@Payload MessageRequest messageRequest) {
        messagingService.processMessage(messageRequest);
    }

    @GetMapping("/messages/{senderId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve a user's sent messages",
    description = "Retrieves messages sent by a given user.")
    public List<MessageResponse> getMessages(@PathVariable("senderId") String senderId) {
        return messagingService.getMessages(senderId);
    }
}
