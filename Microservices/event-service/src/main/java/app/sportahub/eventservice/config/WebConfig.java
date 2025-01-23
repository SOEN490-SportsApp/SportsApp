package app.sportahub.eventservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import app.sportahub.eventservice.converter.SortDirectionConverter;
import app.sportahub.eventservice.converter.EventSortingFieldConverter;


@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080", "https://api-dev.sportahub.app", "https://api.sportahub.app")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
            
            @Override
            public void addFormatters(FormatterRegistry registry) {
                registry.addConverter(new SortDirectionConverter());
                registry.addConverter(new EventSortingFieldConverter());
            }
        };
    }

}
