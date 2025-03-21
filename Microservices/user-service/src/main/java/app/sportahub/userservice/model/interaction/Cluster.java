package app.sportahub.userservice.model.interaction;

import app.sportahub.userservice.model.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@Document("cluster")
@ToString
@Data
public class Cluster extends BaseEntity {

    @NotNull
    private double[] centroids;

    @NotNull
    private List<String> userIds;

    @NotNull
    private List<Integer> clusterAssignments;
}
