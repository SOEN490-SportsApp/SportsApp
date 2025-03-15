package app.sportahub.notificationservice.service.device;

import app.sportahub.notificationservice.dto.request.device.DeviceRequest;
import app.sportahub.notificationservice.dto.response.device.DeviceResponse;

public interface DeviceService {

    DeviceResponse registerDevice(DeviceRequest deviceRequest);

    void deleteDeviceById(String deviceId);

    Boolean isDeviceOwner(String userId, String deviceId);
    
}
