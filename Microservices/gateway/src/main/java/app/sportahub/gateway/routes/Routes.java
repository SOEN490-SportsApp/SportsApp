package app.sportahub.gateway.routes;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return GatewayRouterFunctions.route("user_service")
                .route(RequestPredicates.path("/api/user-service/**"), HandlerFunctions.http("http://user-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> eventServiceRoute() {
        return GatewayRouterFunctions.route("event_service")
                .route(RequestPredicates.path("/api/event-service/**"), HandlerFunctions.http("http://event-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> emailServiceRoute() {
        return GatewayRouterFunctions.route("email_service")
                .route(RequestPredicates.path("/api/email-service/**"), HandlerFunctions.http("http://email-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> messagingServiceRoute() {
        return GatewayRouterFunctions.route("messaging_service")
                .route(RequestPredicates.path("/api/messaging-service/**"), HandlerFunctions.http("http://messaging-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> storageServiceRoute() {
        return GatewayRouterFunctions.route("storage_service")
                .route(RequestPredicates.path("/api/storage-service/**"), HandlerFunctions.http("http://storage-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoute() {
        return GatewayRouterFunctions.route("notification_service")
                .route(RequestPredicates.path("/api/notification-service/**"), HandlerFunctions.http("http://notification-service:8080"))
                .build();
    }
}
