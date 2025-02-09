package app.sportahub.messagingservice.mapper;

import app.sportahub.messagingservice.dto.request.MessageRequest;
import app.sportahub.messagingservice.model.Message;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface MessageMapper {

    @Mapping(target = "messageId", ignore = true)
    @Mapping(target = "chatroomId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Message messageRequestToMessage(MessageRequest messageRequest);
}
