package app.sportahub.userservice.mapper.keycloak;

import java.util.Collections;

import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.AfterMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import app.sportahub.userservice.dto.request.user.keycloak.KeycloakRequest;
import app.sportahub.userservice.model.user.keycloak.KeycloakAccess;
import app.sportahub.userservice.model.user.keycloak.KeycloakUser;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface KeycloakMapper {

    UserRepresentation keycloakRequestToUserRepresentation(KeycloakRequest keycloakRequest);

    KeycloakUser userRepresentationToKeycloakUser(UserRepresentation user);

    void updateUserRepresentation(@MappingTarget UserRepresentation user, KeycloakRequest keycloakRequest);
    
    @AfterMapping
    default void handleCredentials(@MappingTarget UserRepresentation user, KeycloakRequest keycloakRequest) {
        if (keycloakRequest.credentials() != null && !keycloakRequest.credentials().isEmpty()) {
            CredentialRepresentation cred = new CredentialRepresentation();
            cred.setType(keycloakRequest.credentials().get(0).type());
            cred.setValue(keycloakRequest.credentials().get(0).value());
            cred.setTemporary(keycloakRequest.credentials().get(0).temporary());
            user.setCredentials(Collections.singletonList(cred));
        }
    }

    @AfterMapping
    default void handleAccessMapping(@MappingTarget KeycloakUser keycloakUser, UserRepresentation user) {
        if (user.getAccess() != null) {
            keycloakUser.setAccess(KeycloakAccess.builder()
                .withImpersonate(user.getAccess().get("impersonate"))   
                .withView(user.getAccess().get("view"))
                .withManage(user.getAccess().get("manage"))
                .withMapRoles(user.getAccess().get("mapRoles"))
                .withManageGroupMembership(user.getAccess().get("manageGroupMembership"))
                .build());
        }
    }
}