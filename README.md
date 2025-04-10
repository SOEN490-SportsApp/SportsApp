# 🏀 Sporta – Sports Event Organizer

Sporta connects users who are passionate about playing sports, enabling them to create and join public events for games like soccer, basketball, tennis, and more. Users can register, create profiles with their skill levels, and browse events based on location and availability. The app allows for real-time updates on event participation, skill-based filtering, and in-app messaging to coordinate with others. Sporta enables users to post photos and rate fellow players to foster engagement.


---

## 📑 Table of Contents

1. [🎥 Release Demos](#-release-demos)
2. [📂 Important Files](#-important-files)
3. [🧪 Important Tests](#-important-tests)
4. [👥 Team Members](#-team-members)
5. [⚙️ Project Setup & Build Guide](#️-project-setup--build-guide)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#1-clone-the-repository)
    - [Build the Application with Gradle](#2-build-the-application-with-gradle)
    - [Docker Containerization](#3-docker-containerization)
    - [Docker Compose Setup](#4-docker-compose-setup-for-microservices)
    - [Running Multiple Microservices](#5-running-multiple-microservices)

---

## 🎥 Release Demos

- [Release 2 Video Presentation](https://drive.google.com/file/d/1nWpURlvlSsaBed25e8k0oZryIKKR7ceT/view?usp=drive_link)
- [Release 1 Video Presentation](https://drive.google.com/file/d/1eRpaNODa4Dt50EICdGhrMVTBgtZf7av6/view?usp=drive_link)

---
<p align="center">
  <a href="https://youtu.be/4d0tcheM6pI">
    <img src="https://github.com/user-attachments/assets/049ad161-e044-4a47-8b56-973ef32456aa" width="300" />
  </a>
</p>

<h1>Important Files</h1>

### Top 5 most important files:

| File path with clickable GitHub link                                                                                                                                                       | Purpose (1 line description)                                                                                   |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| [ObjectStorageServiceImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/storage-service/src/main/java/app/sportahub/storageservice/service/storage/ObjectStorageServiceImpl.java)                                              | Implements storeFile and getFile methods to deal with images.             |
| [MessagingServiceImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/messaging-service/src/main/java/app/sportahub/messagingservice/service/MessagingServiceImpl.java) | Implements processMessage getMessages, getChatrooms, createChatroom, getChatroom, patchChatroom, deleteChatroom patchMessage, deleteMessage, addMembers, removeMembers, and leaveChatroom functions for the real-time chatting feature|
| [PostServiceImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/main/java/app/sportahub/eventservice/service/social/PostServiceImpl.java)      |  Implements createPost, getAllPostsOrderedByCreationDateInDesc, getPost, deletePost, createComment, deleteComment, reactToPost, isPostCreator, isCommentCreator functions for posts and comments on events.                                              |
| [axios Instance.ts](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/ClientApp/services/axiosInstance.ts)                                                                          | Axios instance that handles api calls with backend to gather information and other logic                       |
| [SearchingEventRepositoryImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/main/java/app/sportahub/eventservice/repository/SearchingEventRepositoryImpl.java)                                                                             | Implements event search and pagination by ensuring accurate and reliable query functionality for the event service                                                                   |

### Top 5 most important tests:

| Test file path with clickable GImplements user registration, user login and user authenticationitHub link                                                                                                                                                                                | Purpose (1 line description)                                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [UserServiceTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/test/java/app/sportahub/userservice/service/user/UserServiceTest.java)                                    | Validates UserService operations, focusing on user management and friend interactions|
| [api.test.ts](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/ClientApp/__tests__/state/user/api.test.ts)                                                                                                       | Tests interactions with api while also including state persistence testing                                      |
| [PostServiceImplTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/test/java/app/sportahub/eventservice/service/social/PostServiceImplTest.java)                               | Tests all logic related to the post and comment handling of the app                                                    |
| [MessagingServiceTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/messaging-service/src/test/java/app/sportahub/messaging_service/service/MessagingServiceTest.java)                                   | Validates MessagingService operations, mainly on making sure private and group messaging is possible.                                 |
| [EventSearchTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/test/java/app/sportahub/userservice/repository/user/SearchingUserRepositoryImplTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/test/java/app/sportahub/eventservice/service/event/EventSearchTest.java)) | Validates event search and pagination by ensuring accurate and reliable query functionality for the event service |
---

## 👥 Team Members

| Name | Student ID | GitHub | Email |
|------|------------|--------|-------|
| Daniel Duguay | 40202775 | [DanDuguay](https://github.com/DanDuguay) | Duguay9@gmail.com |
| Nicolas Chelico | 40156158 | [NicolasChelico](https://github.com/NicolasChelico) | nicolas.chelico@outlook.com |
| Wadeh Hamati | 40216893 | [wade3hamati](https://github.com/wade3hamati) | wade3_hamati@outlook.com |
| Walid Achlaf | 40210355 | [walidoow](https://github.com/walidoow) | walidachlaf@gmail.com |
| Monika Moanes | 40188452 | [MonikaaMoanes](https://github.com/MonikaaMoanes) | monicanasser6@gmail.com |
| Khalil Garaali | 40226310 | [KhalilGarali](https://github.com/KhalilGarali) | garalikhalil@gmail.com |
| Youssef Alsheghri | 40108014 | [yousfino](https://github.com/yousfino) | youssef.alsheghri@gmail.com |
| Ziad Elsharkawi | 40213438 | [Ziadsharkos](https://github.com/Ziadsharkos) | ziadelsharkawi@outlook.com |
| Patrick MacEachen | 40209790 | [patrickmac3](https://github.com/patrickmac3) | patrickmaceachen9@gmail.com |
| Joud Babik | 40031039 | [JRB958](https://github.com/JRB958) | j_babik@live.concordia.ca |
| Jean-Nicolas Sabatini-Ouellet | 40207926 | [wolfie7679](https://github.com/wolfie7679) | je_sabat@live.concordia.ca |

---

## ⚙️ Project Setup & Build Guide

### Prerequisites

Ensure the following tools are installed:

- Git
- Docker
- Java JDK 21
- Gradle (or use `./gradlew` wrapper)
- **Note that this is the main setup for the backend. In order to setup the frontend, please consult the following [README.md](https://github.com/SOEN490-SportsApp/SportsApp/tree/chore/issue-137/read-me-setup-for-project/ClientApp#readme
) to understand more about the Expo app.**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

---

### 2. Build the Application with Gradle

Use the Gradle wrapper to build the project:

```bash
./gradlew build
```

This command compiles, packages, and runs all unit tests.

---

### 3. Docker Containerization

#### 🔹 Build the JAR

```bash
./gradlew build
```

The generated JAR file will be located in `build/libs/` as `project-name-0.0.1-SNAPSHOT.jar`.

#### 🔹 Build Docker Image

```bash
docker build --build-arg JAR_FILE=build/libs/project-name-0.0.1-SNAPSHOT.jar -t project-image .
```

#### 🔹 Run Docker Container

```bash
docker run -p 8080:8080 --env-file .env project-image
```

> Replace `.env` with the path to your environment variable file, or set the variables directly in the command line.

#### Gradle Build and Dependency Configuration
The `build.gradle` file specifies dependencies, configurations, and build tasks. Key sections include:

---

### 4. Docker Compose Setup for Microservices
This project relies on several microservices, each with its own Docker setup. All microservices depend on the services defined in a shared `docker-compose.yml` file, which includes services such as MongoDB, MySQL (for Keycloak), and Keycloak itself. These services must be running for the microservices to function properly.
The `docker-compose.yml` file configures and manages the required services. You will need to ensure that the services are up and running before starting any microservice.

We use a **monorepo architecture** with services located in `Microservices/<service-name>`.

Here are the required backend services:

| Microservice           | Docker Package                     |
|------------------------|------------------------------------|
| Event Service          | `sportsapp-event-service`          |
| User Service           | `sportsapp-user-service`           |
| Messaging Service      | `sportsapp-messaging-service`      |
| Storage Service        | `sportsapp-storage-service`        |
| API Gateway            | `sportsapp-gateway`                |
| Kafka Event Model      | `app.sportahub.kafka-events`       |
| Orchestration Service  | `sportsapp-orchestration-service`  |
| Email Service          | `sportsapp-email-service`          |
| Notification Service   | `sportsapp-notification-service`   |

---
#### How to Set it Up:
1. Navigate to the directory of the microservice you want to run.

2. Make sure the `docker-compose.yml` file is present and configured.

3. Run the following command to start all the required services for that microservice:

```bash
docker-compose up --build
```
Once the services are up and running, the microservice will be able to interact with MongoDB, Keycloak, and other dependencies.

---

### 5. Running Multiple Microservices
The project consists of several microservices, each located in its respective folder under `Microservices/<service-name>`. The README assumes the backend is located at the root of the project directory, but since we have multiple microservices, each microservice has its own folder and configuration.

To run a specific microservice, you need to follow the setup steps (including using Docker Compose) inside each microservice directory:
1. Navigate to the corresponding microservice directory under `Microservices/`:
```bash
cd Microservices/<service-name>
```

2. Run Docker Compose for that microservice:
```bash
docker-compose up --build
```

This ensures that each microservice runs with its own set of services (like databases or authentication), and you can independently manage and deploy them as needed.

#### Running the Application
After building the project and Docker image, you can access the application at `http://localhost:8080`

---