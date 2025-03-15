package app.sportahub.notificationservice.service.device;

import app.sportahub.notificationservice.dto.request.device.DeviceRequest;
import app.sportahub.notificationservice.dto.response.device.DeviceResponse;
import app.sportahub.notificationservice.mapper.device.DeviceMapper;
import app.sportahub.notificationservice.model.device.Device;
import app.sportahub.notificationservice.repository.device.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service("deviceService")
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;

    private final DeviceMapper deviceMapper;

    /**
     * Registers a device for the currently authenticated user.
     * <p>
     * If a device with the same token is already registered for the user, it is returned without modification.
     * Otherwise, a new device is created, saved to the database, and returned.
     * </p>
     *
     * @param deviceRequest the request containing the device token to be registered
     * @return the registered {@link Device} instance
     */
    @Override
    public DeviceResponse registerDevice(DeviceRequest deviceRequest) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Device> optionalDevice = deviceRepository.findDeviceByUserIdAndDeviceToken(userId, deviceRequest.deviceToken());
        if (optionalDevice.isPresent()) {
            log.info("DeviceServiceImpl::registerDevice: Device already registered {}", optionalDevice);
            return deviceMapper.deviceToDeviceResponse(optionalDevice.get());
        }

        Device device = Device.builder()
                .withUserId(userId)
                .withDeviceToken(deviceRequest.deviceToken())
                .build();

        log.info("DeviceServiceImpl::registerDevice: Registering device {}", device);
        Device savedDevice = deviceRepository.save(device);
        log.info("DeviceServiceImpl::registerDevice: Successfully registered device {}", device);
        return deviceMapper.deviceToDeviceResponse(savedDevice);
    }

    /**
     * Deletes a device by its unique identifier.
     * <p>
     * This method removes the device from the repository if it exists.
     * No action is taken if the device does not exist.
     * </p>
     *
     * @param deviceId the unique identifier of the device to be deleted
     */
    @Override
    public void deleteDeviceById(String deviceId) {
        log.info("DeviceServiceImpl::deleteDeviceById: Deleting device with id {}", deviceId);
        deviceRepository.deleteById(deviceId);
        log.info("DeviceServiceImpl::deleteDeviceById: Successfully deleted device with id {}", deviceId);
    }

    /**
     * Checks if a given user is the owner of a specified device.
     * <p>
     * This method verifies whether the device with the given ID belongs to the specified user.
     * </p>
     *
     * @param userId   the unique identifier of the user
     * @param deviceId the unique identifier of the device
     * @return {@code true} if the user owns the device, {@code false} otherwise
     */
    @Override
    public Boolean isDeviceOwner(String userId, String deviceId) {
        Optional<Device> optionalDevice = deviceRepository.findDeviceByUserIdAndId(userId, deviceId);
        return optionalDevice.isPresent();
    }
}
