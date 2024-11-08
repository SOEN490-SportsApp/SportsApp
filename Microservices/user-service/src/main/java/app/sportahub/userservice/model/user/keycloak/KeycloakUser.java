package app.sportahub.userservice.model.user.keycloak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class KeycloakUser {

    private String id;
    private String username;
    private String email;
    private boolean emailVerified;
    private long createdTimestamp;
    private boolean enabled;
    private boolean totp;
    private List<String> disableableCredentialTypes;
    private List<String> requiredActions;
    private int notBefore;
    private KeycloakAccess access;
}
