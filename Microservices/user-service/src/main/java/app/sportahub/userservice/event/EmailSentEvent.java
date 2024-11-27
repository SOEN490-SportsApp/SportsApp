package app.sportahub.userservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailSentEvent {
    private String recipientEmailAddress;
    private String senderEmailAddress;
    private String subject;
    private String body;
    private String htmlContent;
}
