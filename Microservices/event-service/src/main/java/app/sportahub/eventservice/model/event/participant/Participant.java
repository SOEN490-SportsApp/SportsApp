package app.sportahub.eventservice.model.event.participant;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Participant {

    @NotBlank(message = "Valid user id must be provided")
    private String userId;

    @Field
    private ParticipantAttendStatus attendStatus;

    @NotBlank(message = "Date user joined must be provided")
    private LocalDate joinedOn;
}
