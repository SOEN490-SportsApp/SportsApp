package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafkevents.BaseEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordSendEmailEvent;
import app.sportahub.kafkevents.forgotPassword.ForgotPasswordEvent;
import app.sportahub.orchestrationservice.service.producer.EmailServiceProducer;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceConsumerImpl implements UserServiceConsumer {

    private final EmailServiceProducer emailServiceProducer;

    @SneakyThrows
    @KafkaListener(topics = ForgotPasswordEvent.SEND_REQUEST_TOPIC, groupId ="UserServiceKafkaConsumer")
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent) {
        log.info("EmailServiceProducerImpl::listenForForgotPasswordRequestedEvent: received forgot password request with email : {} ", forgotPasswordRequestedEvent.getEmail());

        BaseEvent baseEvent = new BaseEvent(
                UUID.randomUUID().toString(),
                "request",
                "orchestration-service",
                Instant.now(),
                UUID.randomUUID().toString());

        ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent = new ForgotPasswordSendEmailEvent(
                baseEvent,
                forgotPasswordRequestedEvent.getEmail()
        );
        emailServiceProducer.sendForgotPasswordSendEmailEvent(forgotPasswordSendEmailEvent);
    }
}
