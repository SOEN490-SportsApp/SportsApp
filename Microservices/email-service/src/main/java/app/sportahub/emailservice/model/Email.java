package app.sportahub.emailservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Email{
    private String senderEmailAddress;
    private String recipientEmailAddress;
    private List<String>  ccRecipients;
    private List<String>  bccRecipients;
    private String subject;
    private String body;
}
