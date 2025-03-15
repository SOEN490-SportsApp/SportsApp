package app.sportahub.notificationservice.service.device;

import app.sportahub.notificationservice.dto.request.device.DeviceRequest;
import app.sportahub.notificationservice.dto.response.device.DeviceResponse;
import app.sportahub.notificationservice.model.device.Device;

import java.util.List;

public interface DeviceService {

    DeviceResponse registerDevice(DeviceRequest deviceRequest);

    void deleteDeviceById(String deviceId);

    void deleteDeviceByDeviceToken(String deviceToken);

    Boolean isDeviceOwner(String userId, String deviceId);

    List<Device> getDevicesByUserId(String userId);
}
