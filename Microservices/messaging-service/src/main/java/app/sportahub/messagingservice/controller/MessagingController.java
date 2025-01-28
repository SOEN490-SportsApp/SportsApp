package app.sportahub.messagingservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/messaging")
@RequiredArgsConstructor
@Tag(name = "Messaging Management", description = "Operations related to messaging")
public class MessagingController {
}
