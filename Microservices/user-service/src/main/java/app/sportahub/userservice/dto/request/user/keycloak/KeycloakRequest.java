package app.sportahub.userservice.dto.request.user.keycloak;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record KeycloakRequest(
        String email,
        String username,
        String firstName,
        String lastName,
        Boolean enabled,
        List<Credentials> credentials,
        Map<String, List<String>> attributes
        ) {

    public KeycloakRequest(String email, String username, String password) {
        this( email, username, null, null, true, List.of(new Credentials(password)), null);
    }

    public KeycloakRequest(String firstName, String lastName) {
        this( null, null, firstName, lastName, null, null, null);
    }

    public record Credentials(
            String type,
            String value,
            Boolean temporary
    ) {
        public Credentials(String password) {
            this("password", password, false);
        }
    }
}
