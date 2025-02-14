package app.sportahub.eventservice.model.social;

import app.sportahub.eventservice.model.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = false)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class Comment extends BaseEntity {

    @NotBlank(message = "Comment content must be provided")
    private String content;

    @NotBlank(message = "Valid id of the user who created the comment must be provided")
    private String createdBy;
}
