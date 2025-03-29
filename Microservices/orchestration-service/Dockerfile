FROM amazoncorretto:21-alpine

RUN apk add --no-cache wget

ARG JAR_FILE

ENV KAFKA_BOOTSTRAP_SERVERS=$KAFKA_BOOTSTRAP_SERVERS

COPY ${JAR_FILE} /app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app.jar"]
