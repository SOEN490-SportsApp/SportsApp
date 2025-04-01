package app.sportahub.gateway.routes;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class Routes {

    @Bean
    RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes().route("user_service", r -> r.path("/api/user-service/**").uri("http://user-service:8080"))
                .route("event_service", r -> r.path("/api/event-service/**").uri("http://event-service:8080"))
                .route("email_service", r -> r.path("/api/email-service/**").uri("http://email-service:8080"))
                .route("messaging_service_ws",r -> r.path("/api/messaging-service/ws").uri("ws://messaging-service:8080/api/messaging-service/ws"))
                .route("messaging_service", r -> r.path("/api/messaging-service/**").uri("http://messaging-service:8080"))
                .route("storage_service", r -> r.path("/api/storage-service/**").uri("http://storage-service:8080"))
                .route("notification_service", r -> r.path("/api/notification-service/**").uri("http://notification-service:8080"))
                .build();
    }

}
