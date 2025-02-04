package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.emailservice.service.EmailService;
import app.sportahub.kafkevents.ForgotPasswordValidateEvent;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestrationServiceConsumerImpl implements OrchestrationServiceConsumer {

    private final EmailService emailService;

    @Override
    @KafkaListener(topics = "forgot-password.email-send", groupId ="OrchServiceKafkaConsumer")
    public void listenForForgotPasswordValidateEvent(ForgotPasswordValidateEvent forgotPasswordValidateEvent) throws MessagingException {
        log.info("OrchestrationServiceConsumerImpl::listenForForgotPasswordValidateEvent: received event: {}", forgotPasswordValidateEvent);
        emailService.sendForgotPasswordEmail(forgotPasswordValidateEvent.getEmail());
    }
}
