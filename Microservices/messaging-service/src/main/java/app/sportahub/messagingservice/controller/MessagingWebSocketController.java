package app.sportahub.messagingservice.controller;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

@Controller
@RequestMapping("/messaging")
@RequiredArgsConstructor
@Tag(name = "Messaging Management", description = "Operations related to messaging")
public class MessagingWebSocketController {

    private final MessagingService messagingService;

    @MessageMapping("/message")
    public void processMessage(@Payload MessageRequest messageRequest) {
        messagingService.processMessage(messageRequest);
    }
}
