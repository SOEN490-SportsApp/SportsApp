package app.sportahub.eventservice.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class KeycloakJwtAuthenticationConverterTest {

    @Mock
    private Jwt jwt;

    @Mock
    private Converter<Map<String, Object>, Collection<GrantedAuthority>> authoritiesConverter;

    @InjectMocks
    private KeycloakJwtAuthenticationConverter converter;

    @BeforeEach
    public void setup() {
        converter = new KeycloakJwtAuthenticationConverter();
    }

    @Test
    public void testConvert_withValidRoles() {
        when(jwt.getClaims()).thenReturn(Map.of("realm_access", Map.of("roles", List.of("user", "admin"))));

        Collection<GrantedAuthority> authorities = converter.convert(jwt);

        assertEquals(2, authorities.size());
        assertEquals("ROLE_USER", authorities.stream().findFirst().get().getAuthority());
    }

    @Test
    public void testConvert_withEmptyRolesList() {
        when(jwt.getClaims()).thenReturn(Map.of("realm_access", Map.of("roles", List.of())));

        Collection<GrantedAuthority> authorities = converter.convert(jwt);

        assertEquals(0, authorities.size());
    }

    @Test
    public void testConvert_withNoRoles() {
        when(jwt.getClaims()).thenReturn(Map.of("realm_access", Map.of()));

        Collection<GrantedAuthority> authorities = converter.convert(jwt);

        assertEquals(0, authorities.size());
    }

    @Test
    public void testConvert_withNoRealmAccess() {
        when(jwt.getClaims()).thenReturn(Map.of());

        Collection<GrantedAuthority> authorities = converter.convert(jwt);

        assertEquals(0, authorities.size());
    }

    @Test
    public void testJwtAuthenticationConverter_withAuthoritiesConverter() {
        Collection<GrantedAuthority> expectedAuthorities = List.of();
        when(authoritiesConverter.convert(any())).thenReturn(expectedAuthorities);

        JwtAuthenticationConverter authenticationConverter = KeycloakJwtAuthenticationConverter
                .jwtAuthenticationConverter(authoritiesConverter);

        Jwt jwt = new Jwt("tokenValue", Instant.now(), Instant.now().plusSeconds(60), Map.of("alg", "none"), Map.of("someKey", "someValue"));

        JwtAuthenticationToken authenticationToken = (JwtAuthenticationToken) authenticationConverter.convert(jwt);

        assertEquals(expectedAuthorities, authenticationToken.getAuthorities());

        verify(authoritiesConverter, times(1)).convert(jwt.getClaims());
    }
}
