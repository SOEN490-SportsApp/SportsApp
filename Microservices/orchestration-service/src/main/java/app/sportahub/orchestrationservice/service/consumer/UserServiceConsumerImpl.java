package app.sportahub.orchestrationservice.service.consumer;

import app.sportahub.kafkevents.ForgotPasswordRequestedEvent;
import app.sportahub.kafkevents.ForgotPasswordSendEmailEvent;
import app.sportahub.orchestrationservice.service.producer.EmailServiceProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceConsumerImpl implements UserServiceConsumer {

    private final EmailServiceProducer emailServiceProducer;

    @KafkaListener(topics = "forgot-password.request", groupId ="UserServiceKafkaConsumer")
    public void listenForForgotPasswordRequestedEvent(ForgotPasswordRequestedEvent forgotPasswordRequestedEvent) {
        log.info("EmailServiceProducerImpl::sendForgotPasswordValidateEvent: received forgot password request with email : {} ", forgotPasswordRequestedEvent.getEmail());
        ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent = new ForgotPasswordSendEmailEvent(
                forgotPasswordRequestedEvent.getBaseEvent(),
                forgotPasswordRequestedEvent.getEmail()
        );
        emailServiceProducer.sendForgotPasswordValidateEvent(forgotPasswordSendEmailEvent);
    }
}
