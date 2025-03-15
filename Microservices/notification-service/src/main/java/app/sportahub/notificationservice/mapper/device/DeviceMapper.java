package app.sportahub.notificationservice.mapper.device;

import app.sportahub.notificationservice.dto.response.device.DeviceResponse;
import app.sportahub.notificationservice.model.device.Device;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface DeviceMapper {

    DeviceResponse deviceToDeviceResponse(Device device);
}
