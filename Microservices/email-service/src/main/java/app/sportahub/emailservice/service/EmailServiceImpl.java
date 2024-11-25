package app.sportahub.emailservice.service;

import app.sportahub.emailservice.config.ResendConfig;
import app.sportahub.emailservice.dto.request.EmailRequestDTO;
import app.sportahub.emailservice.event.EmailSentEvent;
import com.resend.*;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final Resend resend;

    public EmailServiceImpl(ResendConfig config) {
        this.resend = new Resend(config.getApiKey());
    }

    @KafkaListener(topics = "email-sent")
    public void listen(EmailSentEvent emailSentEvent) {
        try{
            log.info("Received email sent: {}", emailSentEvent);
            EmailRequestDTO emailRequestDTO = new EmailRequestDTO();
            emailRequestDTO.setRecipientEmailAddress(emailSentEvent.getRecipientEmailAddress());
            emailRequestDTO.setSenderEmailAddress(emailSentEvent.getSenderEmailAddress());
            emailRequestDTO.setSubject(emailSentEvent.getSubject());
            emailRequestDTO.setBody(emailSentEvent.getBody());
            sendEmail(emailRequestDTO);
        }
        catch (Exception e) {

        }
    }

    @Override
    @SneakyThrows
    public void sendEmail(EmailRequestDTO emailRequest) {
        log.info("EmailServiceImpl::sendEmail: Attempting to send email to {}", emailRequest.getRecipientEmailAddress());

        String from = emailRequest.getSenderEmailAddress();
        String to = emailRequest.getRecipientEmailAddress();
        String subject = emailRequest.getSubject();
        String body = emailRequest.getBody();
        String htmlContent = emailRequest.getHtmlContent();

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(from)
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        CreateEmailResponse response = resend.emails().send(params);
        log.info("Email sent successfully with ID: {}", response.getId());
    }
}


