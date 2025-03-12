FROM amazoncorretto:21-alpine

RUN apk add --no-cache wget

ARG JAR_FILE

ENV LOGSTASH_HOST=$LOGSTASH_HOST \
    LOGSTASH_PORT=$LOGSTASH_PORT

COPY ${JAR_FILE} /app.jar

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --spider http://localhost/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app.jar"]
