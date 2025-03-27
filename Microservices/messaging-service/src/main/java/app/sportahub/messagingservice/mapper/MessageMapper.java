package app.sportahub.messagingservice.mapper;

import app.sportahub.messagingservice.dto.request.message.MessageRequest;
import app.sportahub.messagingservice.dto.response.message.MessageResponse;
import app.sportahub.messagingservice.model.Message;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface MessageMapper {

    @Mapping(target = "messageId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Message messageRequestToMessage(MessageRequest messageRequest);

    @Mapping(target = "messageId", ignore = true)
    @Mapping(target = "chatroomId", ignore = true)
    @Mapping(target = "senderId", ignore = true)
    @Mapping(target = "senderName", ignore = true)
    @Mapping(target = "receiverIds", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchMessageFromRequest(MessageRequest messageRequest, @MappingTarget Message message);

    MessageResponse MessageToMessageResponse(Message savedMessage);
}
