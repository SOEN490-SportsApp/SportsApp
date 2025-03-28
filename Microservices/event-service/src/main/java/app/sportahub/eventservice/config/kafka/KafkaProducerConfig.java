package app.sportahub.eventservice.config.kafka;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import java.util.UUID;

@EnableKafka
@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.producer.bootstrap-servers}")
    private String port;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, port);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(ProducerFactory<String, Object> producerFactory) {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ReplyingKafkaTemplate<String, Object, Object> replyingKafkaTemplate(
            ProducerFactory<String, Object> producerFactory,
            KafkaMessageListenerContainer<String, Object> replyContainer) {
        ReplyingKafkaTemplate<String, Object, Object> template = new ReplyingKafkaTemplate<>(producerFactory, replyContainer);
        template.setDefaultReplyTimeout(Duration.ofSeconds(6));
        return template;
    }

    @Bean
    public KafkaMessageListenerContainer<String, Object> replyContainer(
            ConsumerFactory<String, Object> consumerFactory) {
        ContainerProperties containerProperties = new ContainerProperties(UserEvent.RESPONSE_TOPIC);
        containerProperties.setGroupId("OrchestrationServiceConsumer");
        return new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
    }
}