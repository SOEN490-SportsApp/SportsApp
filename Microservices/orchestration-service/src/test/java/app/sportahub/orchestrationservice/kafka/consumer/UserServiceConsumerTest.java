package app.sportahub.orchestrationservice.kafka.consumer;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;
import app.sportahub.orchestrationservice.service.consumer.UserServiceConsumerImpl;
import app.sportahub.orchestrationservice.service.producer.EmailServiceProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class UserServiceConsumerTest {
    @Mock
    private EmailServiceProducer emailServiceProducer;

    @InjectMocks
    private UserServiceConsumerImpl userServiceConsumer;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testListenForForgotPasswordRequestedEvent() {
        String email = "test@example.com";
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString());
        ForgotPasswordRequestedEvent event = new ForgotPasswordRequestedEvent(baseEvent, email);

        ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent = new ForgotPasswordSendEmailEvent(
                event.getBaseEvent(),
                event.getEmail()
        );

        userServiceConsumer.listenForForgotPasswordRequestedEvent(event);

        verify(emailServiceProducer, times(1)).sendForgotPasswordSendEmailEvent(forgotPasswordSendEmailEvent);
    }

}
