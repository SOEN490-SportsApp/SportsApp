package app.sportahub.messagingservice.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.sql.Timestamp;
import java.util.Set;

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

    private String chatroomId;

    @NotNull
    private String senderId;

    @NotEmpty
    @Size(min = 1, max = 255)
    private Set<String> receiverIds;

    @NotNull
    private String content;

    private Timestamp createdAt;
}
