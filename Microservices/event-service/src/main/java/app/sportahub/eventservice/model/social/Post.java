package app.sportahub.eventservice.model.social;

import app.sportahub.eventservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collections;
import java.util.List;

@EqualsAndHashCode(callSuper = false)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "posts")
@ToString
@Data
public class Post extends BaseEntity {

    @NotBlank(message = "Valid id of the event must be provided")
    private String eventId;

    @NotBlank(message = "Post content must be provided")
    private String content;

    @NotBlank(message = "Valid id of the user who created the post must be provided")
    private String createdBy;

    @Builder.Default
    private List<String> attachments = Collections.emptyList();

    @DBRef(lazy = true)
    @Builder.Default
    private List<Comment> comments = Collections.emptyList();
}
