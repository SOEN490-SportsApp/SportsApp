package app.sportahub.orchestrationservice.service.producer;

import app.sportahub.ForgotPasswordSendEmailEvent;
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
    public void sendForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent){
        kafkaTemplate.send("forgot-password.send-email", forgotPasswordSendEmailEvent);
        log.info("EmailServiceProducerImpl::sendForgotPasswordSendEmailEvent: forgot password reset email sent to 'forgot-password.send-email' topic");
    }
}
