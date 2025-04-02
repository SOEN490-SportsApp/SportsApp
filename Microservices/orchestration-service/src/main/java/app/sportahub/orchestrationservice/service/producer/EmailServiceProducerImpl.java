package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafka.events.ForgotPasswordEvent;
import app.sportahub.kafka.events.ForgotPasswordSendEmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceProducerImpl implements EmailServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @SneakyThrows
    @Override
    public void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent){
        kafkaTemplate.send(ForgotPasswordEvent.SEND_EMAIL_TOPIC, forgotPasswordSendEmailEvent);
        log.info("EmailServiceProducerImpl::sendForgotPasswordSendEmailEvent: forgot password reset email sent to 'forgot-password.send-email' topic");
    }
}
