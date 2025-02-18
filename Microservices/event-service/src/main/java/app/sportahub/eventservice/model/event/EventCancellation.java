package app.sportahub.eventservice.model.event;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventCancellation {
    private String cancelledBy;
    private String reason;
    private Timestamp cancelledAt;
}
