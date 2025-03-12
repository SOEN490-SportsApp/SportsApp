package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;
import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.emailservice.service.EmailService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class OrchestrationServiceTest {
    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrchestrationServiceConsumerImpl orchestrationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testListenForForgotPasswordSendEmailEvent() throws MessagingException {
        String email = "test@example.com";
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString());
        ForgotPasswordSendEmailEvent event = new ForgotPasswordSendEmailEvent(baseEvent, email);

        orchestrationService.listenForForgotPasswordSendEmailEvent(event);

        verify(emailService, times(1)).sendForgotPasswordEmail(event.getEmail());
    }
}