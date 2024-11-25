package app.sportahub.emailservice.service;

import app.sportahub.emailservice.dto.request.EmailRequestDTO;

public interface EmailService {
    void sendEmail(EmailRequestDTO emailRequest);
}
