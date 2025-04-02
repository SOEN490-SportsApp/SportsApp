package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.kafka.events.SportaKafkaEvents;
import app.sportahub.kafka.events.forgotpassword.ForgotPasswordSendEmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestrationServiceConsumerImpl implements OrchestrationServiceConsumer {

    @Override
    @KafkaListener(topics = SportaKafkaEvents.SEND_EMAIL_TOPIC, groupId ="OrchServiceKafkaConsumer")
    public void listenForForgotPasswordSendEmailEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent){
        log.info("OrchestrationServiceConsumerImpl::ForgotPasswordSendEmailEvent: received forgot password request with email: {}", forgotPasswordSendEmailEvent.getEmail());
    }
}
