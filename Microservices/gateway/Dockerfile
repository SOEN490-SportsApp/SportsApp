FROM alpine/java:21-jdk

ARG JAR_FILE

ENV SERVER_PORT=8080

COPY ${JAR_FILE} /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar", "--server.port=${SERVER_PORT}"]