package app.sportahub.emailservice.service;

import app.sportahub.emailservice.dto.request.EmailRequest;

public interface EmailService {
    void sendEmail(EmailRequest emailRequest);
}
