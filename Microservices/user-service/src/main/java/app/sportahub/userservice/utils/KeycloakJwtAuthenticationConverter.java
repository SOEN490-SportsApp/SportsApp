package app.sportahub.userservice.utils;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {

        Object realmAccess = jwt.getClaims().get("realm_access");
        if (realmAccess instanceof Map) {
            Map<String, Object> realmAccessMap = (Map<String, Object>) realmAccess;
            Object roles = realmAccessMap.get("roles");
            if (roles instanceof List) {
                List<String> rolesList = (List<String>) roles;
                return rolesList.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        .collect(Collectors.toList());
            }
        }
        return List.of();
    }

    public static JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakJwtAuthenticationConverter());
        converter.setPrincipalClaimName("user_id");
        return converter;
    }

    @Bean
    public static JwtAuthenticationConverter jwtAuthenticationConverter(
            Converter<Map<String, Object>, Collection<GrantedAuthority>> authoritiesConverter) {
        var authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            return authoritiesConverter.convert(jwt.getClaims());
        });
        return authenticationConverter;
    }

}
