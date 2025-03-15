package app.sportahub.notificationservice.repository.notification;

import app.sportahub.notificationservice.model.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    Page<Notification> findByUserId(String userId, Pageable pageable);

    Page<Notification> findByUserIdAndIsRead(String userId, boolean isRead, Pageable pageable);
}
