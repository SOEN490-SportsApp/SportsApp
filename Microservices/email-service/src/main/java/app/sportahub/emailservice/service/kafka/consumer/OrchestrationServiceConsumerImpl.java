package app.sportahub.emailservice.service.kafka.consumer;

import app.sportahub.ForgotPasswordSendEmailEvent;
import app.sportahub.emailservice.service.EmailService;
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
    public void listenForForgotPasswordValidateEvent(ForgotPasswordSendEmailEvent forgotPasswordSendEmailEvent) throws MessagingException {
        log.info("OrchestrationServiceConsumerImpl::listenForForgotPasswordValidateEvent: received event: {}", forgotPasswordSendEmailEvent);
        emailService.sendForgotPasswordEmail(forgotPasswordSendEmailEvent.getEmail());
    }
}
