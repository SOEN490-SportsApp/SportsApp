package app.sportahub.notificationservice.mapper.notification;

import app.sportahub.notificationservice.dto.request.notification.NotificationRequest;
import app.sportahub.notificationservice.dto.response.notification.NotificationResponse;
import app.sportahub.notificationservice.model.notification.Notification;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface NotificationMapper {

    Notification toEntity(NotificationRequest notificationRequest);

    NotificationResponse toResponseDto(Notification notification);
}
