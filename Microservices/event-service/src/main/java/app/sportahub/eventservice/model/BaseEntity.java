package app.sportahub.eventservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.sql.Timestamp;

@SuperBuilder(toBuilder = true, setterPrefix = "with")
@ToString(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BaseEntity {

    @MongoId(FieldType.OBJECT_ID)
    private String id;
    private Timestamp creationDate;
    private Timestamp updatedAt;
}
