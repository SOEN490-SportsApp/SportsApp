package app.sportahub.notificationservice.service.device;

import app.sportahub.notificationservice.dto.request.device.DeviceRequest;
import app.sportahub.notificationservice.dto.response.device.DeviceResponse;
import app.sportahub.notificationservice.exception.device.UserDoesNotOwnADeviceException;
import app.sportahub.notificationservice.mapper.device.DeviceMapper;
import app.sportahub.notificationservice.model.device.Device;
import app.sportahub.notificationservice.repository.device.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
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
     * Deletes a device by its token.
     * <p>
     * This method removes the device from the repository if it exists.
     * No action is taken if the device does not exist.
     * </p>
     *
     * @param deviceToken the token of the device to be deleted
     */
    @Override
    public void deleteDeviceByDeviceToken(String deviceToken) {
        log.info("DeviceServiceImpl::deleteDeviceByDeviceToken: Deleting device with token {}", deviceToken);
        deviceRepository.deleteByDeviceToken(deviceToken);
        log.info("DeviceServiceImpl::deleteDeviceByDeviceToken: Successfully deleted device with token {}", deviceToken);
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
        log.info("DeviceServiceImpl::isDeviceOwner: Checking ownership of device {} for user {}", deviceId, userId);
        Optional<Device> optionalDevice = deviceRepository.findDeviceByUserIdAndId(userId, deviceId);
        log.info("DeviceServiceImpl::isDeviceOwner: User {} {} the owner of device {}",
                userId, optionalDevice.isPresent() ? "is" : "is not", deviceId);
        return optionalDevice.isPresent();
    }

    /**
     * Retrieves all devices associated with a given user.
     * <p>
     * If the user does not own any devices, an exception is thrown.
     * </p>
     *
     * @param userId the unique identifier of the user
     * @return a list of {@link Device} objects belonging to the user
     * @throws UserDoesNotOwnADeviceException if the user does not own any devices
     */
    @Override
    public List<Device> getDevicesByUserId(String userId) {
        log.info("DeviceServiceImpl::getDevicesByUserId: Fetching devices for user {}", userId);
        List<Device> devices = deviceRepository.findDeviceByUserId(userId);
        if (devices.isEmpty()) {
            log.info("DeviceServiceImpl::getDevicesByUserId: No devices found for user {}", userId);
            throw new UserDoesNotOwnADeviceException(userId);
        }
        log.info("DeviceServiceImpl::getDevicesByUserId: Found {} devices for user {}", devices.size(), userId);
        return devices;
    }
}
