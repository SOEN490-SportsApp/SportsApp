package app.sportahub.messagingservice.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Document("chatroom")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Chatroom {

    @MongoId(FieldType.OBJECT_ID)
    private String chatroomId;

    private String chatroomName;

    @NotNull
    private Timestamp createdAt;

    @NotNull
    private String createdBy;

    @NotEmpty
    @Size(min = 1, max = 255)
    private Set<Member> members;

    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @NotNull
    @Builder.Default
    private Boolean isEvent = false;

    @NotNull
    @Builder.Default
    private Boolean unread = true;
}
