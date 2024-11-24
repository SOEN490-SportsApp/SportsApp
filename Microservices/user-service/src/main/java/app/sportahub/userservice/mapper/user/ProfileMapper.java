package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.model.user.Profile;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface ProfileMapper {

    ProfileResponse profileToProfileResponse(Profile profile);

    Profile profileRequestToProfile(ProfileRequest profileRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchProfileFromRequest(ProfileRequest profileRequest, @MappingTarget Profile profile);
}
