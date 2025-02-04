package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.kafkevents.ForgotPasswordSendEmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceProducerImpl implements EmailServiceProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendForgotPasswordValidateEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent){
        kafkaTemplate.send("forgot-password.email-send", forgotPasswordSendEmailEvent);
        log.info("EmailServiceProducerImpl::sendForgotPasswordValidateEvent: forgot password reset email sent to 'forgot-password.email-send' topic");
    }
}
