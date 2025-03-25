package app.sportahub.messagingservice.mapper;

import app.sportahub.messagingservice.dto.request.chatroom.ChatroomRequest;
import app.sportahub.messagingservice.dto.response.chatroom.ChatroomResponse;
import app.sportahub.messagingservice.model.Chatroom;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface ChatroomMapper {

    ChatroomResponse chatroomToChatroomResponse(Chatroom chatroom);
    Chatroom chatroomRequestToChatroom(ChatroomRequest chatroomRequest);

    @Mapping(target = "chatroomId", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchChatroomFromRequest(ChatroomRequest chatroomRequest, @MappingTarget Chatroom chatroom);
}