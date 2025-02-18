package app.sportahub.userservice.mapper.keycloak;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.model.user.keycloak.KeycloakAccess;
import app.sportahub.userservice.model.user.keycloak.KeycloakUser;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public class KeycloakMapper {

    public UserRepresentation keycloakRequestToUserRepresentation(KeycloakRequest keycloakRequest) {
        UserRepresentation user = new UserRepresentation();
        // set user attributes
        user.setUsername(keycloakRequest.username());
        user.setFirstName(keycloakRequest.firstName());
        user.setLastName(keycloakRequest.lastName());
        user.setEmail(keycloakRequest.email());
        user.setEnabled(keycloakRequest.enabled());
        user.setAttributes(keycloakRequest.attributes());
        // setn credentials
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(keycloakRequest.credentials().get(0).type());
        credential.setValue(keycloakRequest.credentials().get(0).value());
        credential.setTemporary(keycloakRequest.credentials().get(0).temporary());
        user.setCredentials(Collections.singletonList(credential));

        return user;
    }

    public KeycloakUser userRepresentationTKeycloakUser(UserRepresentation user){
        return KeycloakUser.builder()
            .withId(user.getId())
            .withUsername(user.getUsername())
            .withEmail(user.getEmail())
            .withEmailVerified(user.isEmailVerified())
            .withCreatedTimestamp(user.getCreatedTimestamp())
            .withEnabled(user.isEnabled())
            .withTotp(user.isTotp())
            .withDisableableCredentialTypes((List<String>) user.getDisableableCredentialTypes())
            .withRequiredActions((List<String>) user.getRequiredActions())
            .withNotBefore(user.getNotBefore())
            .withAccess(KeycloakAccess.builder()
                .withImpersonate(user.getAccess().get("impersonate"))   
                .withView(user.getAccess().get("view"))
                .withManage(user.getAccess().get("manage"))
                .withMapRoles(user.getAccess().get("mapRoles"))
                .withManageGroupMembership(user.getAccess().get("manageGroupMembership"))
                .build())
            .build();
    }

}
