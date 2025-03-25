package app.sportahub.messagingservice.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Document("message")
@Data
@SuperBuilder(toBuilder = true, setterPrefix = "with")
public class Message {

    @MongoId(FieldType.OBJECT_ID)
    private String messageId;

    @NotNull
    private String chatroomId;

    @NotNull
    private String senderId;

    private String senderName;

    @NotEmpty
    @Size(min = 1, max = 255)
    private Set<String> receiverIds;

    @NotNull
    private String content;

    private Timestamp createdAt;

    @Pattern(regexp = "/[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;")
    private List<String> attachments;
}
