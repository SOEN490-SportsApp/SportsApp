package app.sportahub.messagingservice.model;

import app.sportahub.messagingservice.enums.MessageTypeEnum;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Document("message")
@Data
@Builder
public class Message {

    @MongoId(FieldType.OBJECT_ID)
    private String messageId;

    @NotNull
    private String chatroomId;

    @NotNull
    private String senderId;

    @NotNull
    private String receiverId;

    @NotNull
    private String content;

    private Timestamp createdAt;
}
