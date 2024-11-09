<h1 align="center">Sporta</h1>

### Project Summary:  
Sporta connects users who are passionate about playing sports, enabling them to create and join public events for games like soccer, basketball, tennis, and more. Users can register, create profiles with their skill levels, and browse events based on location and availability. The app allows for real-time updates on event participation, skill-based filtering, and in-app messaging to coordinate with others. Sporta enables users to post photos and rate fellow players to foster engagement.

### Team Members:
| Name                   | Student ID | GitHub ID | Email Address |
| ------------------------ | ------------ | ----------------- | ----------------- |
| Daniel Duguay	 | 40202775 | DanDuguay | Duguay9@gmail.com |
| Nicolas Chelico	| 40156158 | NicolasChelico |nicolas.chelico@outlook.com |
| Wadeh Hamati	| 40216893 | wade3hamati | wade3_hamati@outlook.com |
| Walid Achlaf	| 40210355 | walidoow | walidachlaf@gmail.com |
| Monika Moanes	| 40188452 | MonikaaMoanes | monicanasser6@gmail.com |
| Khalil Garaali	| 40226310 | KhalilGarali | garalikhalil@gmail.com |
| Youssef Alsheghri	| 40108014 | yousfino | youssef.alsheghri@gmail.com |
| Ziad Elsharkawi	| 40213438 | Ziadsharkos | ziadelsharkawi@outlook.com |
| Patrick MacEachen	| 40209790 | patrickmac3  | patrickmaceachen9@gmail.com |
| Joud Babik | 40031039 | JRB958 | j_babik@live.concordia.ca

### Getting Started with Sporta:  

# Project Setup and Build Guide

This guide provides all the steps needed to set up, build, and run this project, including Docker containerization and Gradle configuration.

## Prerequisites

Before starting, ensure you have the following installed:
- **Git**: for cloning the repository.
- **Docker**: for containerizing the application.
- **Java Development Kit (JDK)**: version 21.
- **Gradle**: or use the Gradle wrapper (`./gradlew`) included in the project.

## Getting Started

### 1. Clone the Repository

First, clone the repository to your local machine:
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Build the Application with Gradle
Use Gradle to build the project and run tests.

### Build the project:
```bash 
./gradlew build
```
This command will compile the project, package it, and run unit tests.

### 3. Docker Containerization
This project uses a Dockerfile to package the application for containerized deployment.

#### Dockerfile Overview
The Dockerfile sets up the container with an OpenJDK base image, configures environment variables, copies the JAR file, and exposes port 8080.

```dockerfile
# Dockerfile contents for reference

FROM openjdk:21-alpine

ARG JAR_FILE

ENV SPRING_APPLICATION_NAME=$SPRING_APPLICATION_NAME \
    SERVER_SERVLET_CONTEXT_PATH=$SERVER_SERVLET_CONTEXT_PATH \
    LOGGING_LEVEL_APP_SPORTAHUB=$LOGGING_LEVEL_APP_SPORTAHUB \
    LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=$LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB \
    KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET \
    KEYCLOAK_REDIRECT_URI=$KEYCLOAK_REDIRECT_URI \
    KEYCLOAK_ISSUER_URI=$KEYCLOAK_ISSUER_URI \
    KEYCLOAK_TOKEN_URI=$KEYCLOAK_TOKEN_URI \
    KEYCLOAK_AUTHORIZATION_URI=$KEYCLOAK_AUTHORIZATION_URI \
    KEYCLOAK_USER_INFO_URI=$KEYCLOAK_USER_INFO_URI \
    KEYCLOAK_JWK_SET_URI=$KEYCLOAK_JWK_SET_URI \
    JWT_ISSUER_URI=$JWT_ISSUER_URI \
    KEYCLOAK_AUTH_SERVER_URL=$KEYCLOAK_AUTH_SERVER_URL \
    KEYCLOAK_REALM=$KEYCLOAK_REALM \
    MONGODB_URI=$MONGODB_URI

COPY ${JAR_FILE} /app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]
```
#### Steps to Build and Run the Docker Image
##### Build the JAR file using Gradle:
```bash
./gradlew build
```
The generated JAR file will be located in `build/libs` as `project-name-0.0.1-SNAPSHOT.jar`.

##### Build the Docker Image:
```bash
docker build --build-arg JAR_FILE=build/libs/project-name-0.0.1-SNAPSHOT.jar -t project-image .
```
##### Run the Docker Container:
To run the container, map port 8080 and use an `.env` file to provide the environment variables:
```bash
docker run -p 8080:8080 --env-file .env project-image
```
Replace `.env` with the path to your environment variable file or set the variables directly in the command.

#### Gradle Build and Dependency Configuration
The `build.gradle` file specifies dependencies, configurations, and build tasks. Key sections include:
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.5'
    id 'io.spring.dependency-management' version '1.1.6'
    id 'idea'
}

group = 'app.sportahub'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    implementation 'io.netty:netty-resolver-dns-native-macos:4.1.114.Final:osx-aarch_64'
    implementation 'org.keycloak:keycloak-spring-boot-starter:24.0.4'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    annotationProcessor 'org.projectlombok:lombok'
    testCompileOnly 'org.projectlombok:lombok'
    testAnnotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'io.projectreactor:reactor-test'
    testImplementation 'org.springframework.security:spring-security-test'
    testImplementation 'org.springframework.boot:spring-boot-testcontainers'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:mongodb'
    testImplementation 'io.rest-assured:rest-assured:5.3.2'
    testImplementation 'org.mockito:mockito-core:5.11.0'
    testImplementation 'org.mockito:mockito-junit-jupiter:5.11.0'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
    testImplementation 'com.github.dasniko:testcontainers-keycloak:2.1.2'
    testImplementation 'org.testcontainers:testcontainers:1.16.3'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

#### Running the Application
After building the project and Docker image, you can access the application at `http://localhost:8080`
