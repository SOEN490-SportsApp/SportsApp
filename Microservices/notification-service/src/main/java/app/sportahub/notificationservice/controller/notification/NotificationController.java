package app.sportahub.notificationservice.controller.notification;

import app.sportahub.notificationservice.dto.response.notification.NotificationResponse;
import app.sportahub.notificationservice.service.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "Notification API")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get paginated notifications for the authenticated user")
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.getNotificationsByUserId(userId, pageable);
    }

    @PatchMapping("/{notificationId}")
    @Operation(summary = "Mark notification as read")
    public NotificationResponse markNotificationAsRead(@PathVariable String notificationId) {
        return notificationService.markNotificationAsRead(notificationId);
    }
}
