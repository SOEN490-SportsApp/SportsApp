package app.sportahub.emailservice.service;
import jakarta.mail.internet.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendForgotPasswordEmail(String email) throws MessagingException, jakarta.mail.MessagingException {
        Context context = new Context();
        String htmlContent = templateEngine.process("email/password-reset", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject("Password Reset");
        helper.setText(htmlContent, true);
        mailSender.send(message);
        log.info("EmailServiceImpl::sendForgotPasswordEmail: Forgot Password Reset Email Sent to {}", email);
    }
}


