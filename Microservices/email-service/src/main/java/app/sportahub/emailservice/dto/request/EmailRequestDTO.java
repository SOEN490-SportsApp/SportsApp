package app.sportahub.emailservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class EmailRequestDTO {
    private String recipientEmailAddress;
    private String senderEmailAddress;
    private String subject;
    private String body;
    private String htmlContent;
}

