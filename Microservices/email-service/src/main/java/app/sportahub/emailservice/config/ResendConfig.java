package app.sportahub.emailservice.config;

import lombok.Getter;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Configuration
@Component
public class ResendConfig {

    @Value("${resend.api.key}")
    private String apiKey;
}

