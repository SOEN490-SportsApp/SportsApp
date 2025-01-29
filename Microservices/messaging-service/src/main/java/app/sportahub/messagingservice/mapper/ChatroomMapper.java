package app.sportahub.messagingservice.mapper;

import app.sportahub.messagingservice.dto.response.chatroom.ChatRoomResponse;
import app.sportahub.messagingservice.model.Chatroom;
import org.mapstruct.Mapper;
import org.mapstruct.Builder;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface ChatroomMapper {

    ChatRoomResponse chatroomToChatroomResponse(Chatroom chatroom);
}
