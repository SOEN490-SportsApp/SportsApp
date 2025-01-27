<h1>Release Demos</h1>

[Release 2 Video Presentation](https://drive.google.com/file/d/1nWpURlvlSsaBed25e8k0oZryIKKR7ceT/view?usp=drive_link)  

[Release 1 Video Presentation](https://drive.google.com/file/d/1eRpaNODa4Dt50EICdGhrMVTBgtZf7av6/view?usp=drive_link)

<h1>Important Files</h1>

### Top 5 most important files:

| File path with clickable GitHub link                                                                                                                                                       | Purpose (1 line description)                                                                                   |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| [build-deploy-microservices.yaml](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/.github/workflows/build-deploy-microservices.yaml)                                              | Detects changes in microservices and rolls out a package update for the affected microservice only             |
| [EventServiceImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/main/java/app/sportahub/eventservice/service/event/EventServiceImpl.java) | Implements event creation, event updates, event deletion, and event participation, the core feature of our app |
| [AuthServiceImpl.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/main/java/app/sportahub/userservice/service/auth/AuthServiceImpl.java)      | Implements user registration, user login and user authentication                                               |
| [axios Instance.ts](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/ClientApp/services/axiosInstance.ts)                                                                          | Axios instance that handles api calls with backend to gather information and other logic                       |
| [eventService.ts](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/ClientApp/services/eventService.ts)                                                                             | Responsible for all event related functions                                                                    |

### Top 5 most important tests:

| Test file path with clickable GitHub link                                                                                                                                                                                | Purpose (1 line description)                                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [UserServiceTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/test/java/app/sportahub/userservice/service/user/UserServiceTest.java)                                    | Validates UserService operations, focusing on user management and friend interactions                           |
| [api.test.ts](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/ClientApp/__tests__/state/user/api.test.ts)                                                                                                       | Tests interactions with api while also including state persistence testing                                      |
| [EventServiceTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/event-service/src/test/java/app/sportahub/eventservice/service/event/EventServiceTest.java)                               | Tests all logic related to the event handling of the app                                                        |
| [AuthServiceTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/test/java/app/sportahub/userservice/controller/AuthControllerTest.java)                                   | Validates AuthService operations, and checking for correct exception returns                                    |
| [SearchingUserRepositoryImplTest.java](https://github.com/SOEN490-SportsApp/SportsApp/blob/main/Microservices/user-service/src/test/java/app/sportahub/userservice/repository/user/SearchingUserRepositoryImplTest.java) | Validates user search and pagination by ensuring accurate and reliable query functionality for the user service |


<h1 align="center">Sporta</h1>

### Project Summary:  
Sporta connects users who are passionate about playing sports, enabling them to create and join public events for games like soccer, basketball, tennis, and more. Users can register, create profiles with their skill levels, and browse events based on location and availability. The app allows for real-time updates on event participation, skill-based filtering, and in-app messaging to coordinate with others. Sporta enables users to post photos and rate fellow players to foster engagement.

### Team Members:

| Name                          | Student ID | GitHub ID      | Email Address               |
|-------------------------------|------------|----------------|-----------------------------|
| Daniel Duguay	                | 40202775   | DanDuguay      | Duguay9@gmail.com           |
| Nicolas Chelico	              | 40156158   | NicolasChelico | nicolas.chelico@outlook.com |
| Wadeh Hamati	                 | 40216893   | wade3hamati    | wade3_hamati@outlook.com    |
| Walid Achlaf	                 | 40210355   | walidoow       | walidachlaf@gmail.com       |
| Monika Moanes	                | 40188452   | MonikaaMoanes  | monicanasser6@gmail.com     |
| Khalil Garaali	               | 40226310   | KhalilGarali   | garalikhalil@gmail.com      |
| Youssef Alsheghri	            | 40108014   | yousfino       | youssef.alsheghri@gmail.com |
| Ziad Elsharkawi	              | 40213438   | Ziadsharkos    | ziadelsharkawi@outlook.com  |
| Patrick MacEachen	            | 40209790   | patrickmac3    | patrickmaceachen9@gmail.com |
| Joud Babik                    | 40031039   | JRB958         | j_babik@live.concordia.ca   |
| Jean-Nicolas Sabatini-Ouellet | 40207926   | wolfie7679     | je_sabat@live.concordia.ca  |

# Project Setup and Build Guide

This guide provides all the steps needed to set up, build, and run this project, including Docker containerization and Gradle configuration. It is important to note that this is the main setup for the backend. In order to setup the frontend, please consult the following [README.md](https://github.com/SOEN490-SportsApp/SportsApp/tree/chore/issue-137/read-me-setup-for-project/ClientApp#readme
) to understand more about the Expo app.

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

### 4. Docker Compose Setup for Microservices
This project relies on several microservices, each with its own Docker setup. All microservices depend on the services defined in a shared `docker-compose.yml` file, which includes services such as MongoDB, MySQL (for Keycloak), and Keycloak itself. These services must be running for the microservices to function properly.
The `docker-compose.yml` file configures and manages the required services. You will need to ensure that the services are up and running before starting any microservice.

#### How to Set it Up:
1. Navigate to the directory of the microservice you want to run.

2. Make sure the `docker-compose.yml` file is present and configured.

3. Run the following command to start all the required services for that microservice:

```bash
docker-compose up --build
```
Once the services are up and running, the microservice will be able to interact with MongoDB, Keycloak, and other dependencies.

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
