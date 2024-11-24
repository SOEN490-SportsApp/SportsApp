package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.model.user.Profile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileResponse profileToProfileResponse(Profile profile);

    Profile profileRequestToProfile(ProfileRequest profileRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchProfileFromRequest(ProfileRequest profileRequest, @MappingTarget Profile profile);
}
