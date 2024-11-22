package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.model.user.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User userRequestToUser(UserRequest userRequest);

    UserResponse userToUserResponse(User user);
}
