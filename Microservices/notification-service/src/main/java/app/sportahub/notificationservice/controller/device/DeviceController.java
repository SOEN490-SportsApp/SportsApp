package app.sportahub.notificationservice.controller.device;

import app.sportahub.notificationservice.dto.request.device.DeviceRequest;
import app.sportahub.notificationservice.dto.response.device.DeviceResponse;
import app.sportahub.notificationservice.service.device.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@Tag(name = "Device Controller", description = "Manage user devices, including registration and deletion")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Register a new device",
            description = "Associates a device with the authenticated user. If the device is already registered, the existing device is returned."
    )
    public DeviceResponse registerDevice(@RequestBody DeviceRequest deviceRequest) {
        return deviceService.registerDevice(deviceRequest);
    }

    @PreAuthorize("@deviceService.isDeviceOwner(authentication.name, #deviceId) || hasRole('ADMIN')")
    @DeleteMapping("/{deviceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Delete a device",
            description = "Removes a device from the system. Only the device owner or an admin can perform this action."
    )
    public void deleteDevice(@PathVariable String deviceId) {
        deviceService.deleteDeviceById(deviceId);
    }
}
