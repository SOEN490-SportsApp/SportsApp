package app.sportahub.userservice.config.auth;

import lombok.Data;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakConfig {

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String adminClientId;

    @Value("${keycloak.credentials.secret}")
    private String adminClientSecret;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .clientSecret(adminClientSecret)
                .clientId(adminClientId)
                .grantType("client_credentials")
                .realm(realm)
                .serverUrl(authServerUrl)
                .build();
    }
}