package app.sportahub.orchestrationservice.kafka.consumer;

import app.sportahub.kafka.events.BaseEvent;
import app.sportahub.kafka.events.forgotpassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafka.events.forgotpassword.ForgotPasswordSendEmailEvent;
import app.sportahub.orchestrationservice.service.consumer.UserServiceConsumerImpl;
import app.sportahub.orchestrationservice.service.producer.EmailServiceProducer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.Mockito.*;

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
        UUID uuid = UUID.randomUUID();
        try(var mocked = mockStatic(UUID.class)){
            mocked.when(UUID::randomUUID).thenReturn(uuid);
            userServiceConsumer.listenForForgotPasswordRequestedEvent(event);
            ArgumentCaptor<ForgotPasswordSendEmailEvent> captor = ArgumentCaptor.forClass(ForgotPasswordSendEmailEvent.class);
            verify(emailServiceProducer, times(1)).sendForgotPasswordSendEmailEvent(captor.capture());

            ForgotPasswordSendEmailEvent capturedEvent = captor.getValue();
            Assertions.assertEquals(email, capturedEvent.getEmail());
            //verify that the base captured event uses randomUUID for ids and check for correct source and event type
            Assertions.assertEquals(uuid.toString() , capturedEvent.getBaseEvent().getEventId());
            Assertions.assertEquals(uuid.toString(), capturedEvent.getBaseEvent().getCorrelationId());
            Assertions.assertEquals(event.getBaseEvent().getEventType(), capturedEvent.getBaseEvent().getEventType());
            Assertions.assertEquals("orchestration-service", capturedEvent.getBaseEvent().getSource());
            //verify randomUUID was called twice (once for eventId and once for correlationId)
            mocked.verify(UUID::randomUUID, times(2));


        }




    }

}
