package app.sportahub.emailservice.service;

import org.springframework.messaging.MessagingException;

public interface EmailService {
    void sendForgotPasswordEmail(String email) throws MessagingException, jakarta.mail.MessagingException;
}
