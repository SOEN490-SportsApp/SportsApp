package app.sportahub.userservice.mapper.user;

import app.sportahub.userservice.model.user.Friend;
import app.sportahub.userservice.model.user.FriendRequest;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface FriendMapper {
    Friend friendRequestToFriend(FriendRequest friendRequest);
}
