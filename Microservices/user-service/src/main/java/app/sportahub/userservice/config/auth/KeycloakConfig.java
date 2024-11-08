package app.sportahub.userservice.config.auth;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakConfig {

    private String authServerUrl;
    private String realm;
    private String adminClientId;
    private String adminClientSecret;
}