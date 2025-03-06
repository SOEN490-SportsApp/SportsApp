package app.sportahub.userservice.service.kafka.producer;

import app.sportahub.BaseEvent;
import app.sportahub.ForgotPasswordRequestedEvent;
import app.sportahub.userservice.client.KeycloakApiClient;
import app.sportahub.userservice.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public void sendPasswordResetEmailUsingKafka(String email) {
        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "user-service",
                Instant.now(),
                UUID.randomUUID().toString());
        ForgotPasswordRequestedEvent forgotPasswordRequestedEvent = new ForgotPasswordRequestedEvent(baseEvent, email);
        kafkaTemplate.send("forgot-password.request", forgotPasswordRequestedEvent);
        log.info("AuthServiceImpl::sendPasswordResetEmail: forgot password reset email sent to 'forgot-password.request' topic");
    }
}
