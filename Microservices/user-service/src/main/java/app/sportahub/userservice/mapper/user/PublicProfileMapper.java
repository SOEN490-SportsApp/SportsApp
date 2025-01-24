package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.response.user.PublicProfileResponse;
import app.sportahub.userservice.model.user.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface PublicProfileMapper {
    PublicProfileResponse userToPublicProfileResponse(User user);
}
