package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordEvent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrchestrationServiceProducerImpl implements OrchestrationServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @SneakyThrows
    @Override
    public void sendPasswordResetEmailUsingKafka(String email) {
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString());
        ForgotPasswordRequestedEvent forgotPasswordRequestedEvent = new ForgotPasswordRequestedEvent(baseEvent, email);
        kafkaTemplate.send(ForgotPasswordEvent.SEND_REQUEST_TOPIC, forgotPasswordRequestedEvent);
        log.info("AuthServiceImpl::sendPasswordResetEmail: forgot password reset email sent to 'forgot-password.request' topic");
    }
}
