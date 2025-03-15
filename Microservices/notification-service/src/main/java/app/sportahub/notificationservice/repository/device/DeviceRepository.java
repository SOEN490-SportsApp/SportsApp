package app.sportahub.notificationservice.repository.device;

import app.sportahub.notificationservice.model.device.Device;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends MongoRepository<Device, String> {

    List<Device> findByUserId(String userId);

    Optional<Device> findDeviceByUserIdAndId(String userId, String id);

    Optional<Device> findDeviceByUserIdAndDeviceToken(String userId, String deviceToken);

}

