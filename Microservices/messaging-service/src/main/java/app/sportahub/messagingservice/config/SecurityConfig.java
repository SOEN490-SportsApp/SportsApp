package app.sportahub.messagingservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.messaging.access.intercept.MessageAuthorizationContext;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.web.SecurityFilterChain;

import app.sportahub.messagingservice.utils.KeycloakJwtAuthenticationConverter;
import lombok.SneakyThrows;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableWebSocketSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final JwtAuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtDecoder jwtDecoder) {
        this.authenticationProvider = new JwtAuthenticationProvider(jwtDecoder);
    }

     @Bean
    public AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
         AuthorizationManager<MessageAuthorizationContext<?>> tokenAuthorizationManager = (auth, context) ->
                 authenticateAndAuthorize(auth.get(), context.getMessage());

        messages
                .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.DISCONNECT).permitAll()
                .anyMessage().access(tokenAuthorizationManager);

        return messages.build();
    }

    private AuthorizationDecision authenticateAndAuthorize(Authentication auth, Message<?> message) {
        String authHeader = null;
        try {
            Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) message.getHeaders().get("nativeHeaders");
            authHeader = nativeHeaders != null ? nativeHeaders.get("Authorization").stream().findFirst().orElse(null) : null;
        } catch (Exception e) {

        }

        try {
            if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
                logger.debug("User already authenticated: {}", auth.getName());
                return new AuthorizationDecision(true);
            } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Authentication authenticatedUser = authenticationProvider.authenticate(new BearerTokenAuthenticationToken(token));
                SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
                logger.debug("Successfully authenticated token for user: {}", authenticatedUser.getName());
                return new AuthorizationDecision(true);
            } else {
                logger.debug("No valid authentication found");
                return new AuthorizationDecision(false);
            }
        } catch (Exception e) {
            logger.error("Authentication failed: {}", e.getMessage(), e);
            return new AuthorizationDecision(false);
        }
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        return KeycloakJwtAuthenticationConverter.jwtAuthenticationConverter();
    }

    @SneakyThrows
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/api-docs",
                                "/api-docs/**",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/ws/**",
                                "/actuator/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(Customizer.withDefaults())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(
                                        jwtAuthenticationConverter())))
                .build();
    }
}
