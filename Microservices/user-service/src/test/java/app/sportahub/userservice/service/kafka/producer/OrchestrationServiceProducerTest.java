package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.kafka.events.forgotpassword.ForgotPasswordRequestedEvent;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class OrchestrationServiceProducerTest {
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OrchestrationServiceProducerImpl orchestrationServiceProducer;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendPasswordResetEmailUsingKafka() {
        String email = "test@example.com";
        orchestrationServiceProducer.sendPasswordResetEmailUsingKafka(email);

        ArgumentCaptor<ForgotPasswordRequestedEvent> eventCaptor = ArgumentCaptor.forClass(ForgotPasswordRequestedEvent.class);
        verify(kafkaTemplate, times(1)).send(eq("forgot-password.request"), eventCaptor.capture());

        ForgotPasswordRequestedEvent sentEvent = eventCaptor.getValue();
        Assertions.assertNotNull(sentEvent);
        Assertions.assertEquals(email, sentEvent.getEmail());
    }
}
