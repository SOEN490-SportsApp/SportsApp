FROM amazoncorretto:21-alpine

RUN apk add --no-cache wget

ARG JAR_FILE

ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET \
    KEYCLOAK_REDIRECT_URI=$KEYCLOAK_REDIRECT_URI \
    KEYCLOAK_ISSUER_URI=$KEYCLOAK_ISSUER_URI \
    KEYCLOAK_TOKEN_URI=$KEYCLOAK_TOKEN_URI \
    KEYCLOAK_AUTHORIZATION_URI=$KEYCLOAK_AUTHORIZATION_URI \
    KEYCLOAK_USER_INFO_URI=$KEYCLOAK_USER_INFO_URI \
    KEYCLOAK_JWK_SET_URI=$KEYCLOAK_JWK_SET_URI \
    JWT_ISSUER_URI=$JWT_ISSUER_URI \
    KEYCLOAK_AUTH_SERVER_URL=$KEYCLOAK_AUTH_SERVER_URL \
    KEYCLOAK_REALM=$KEYCLOAK_REALM

COPY ${JAR_FILE} /app.jar

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --spider http://localhost/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app.jar"]
