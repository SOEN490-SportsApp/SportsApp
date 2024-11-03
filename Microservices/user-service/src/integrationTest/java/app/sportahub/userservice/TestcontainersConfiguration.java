package app.sportahub.userservice;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    MongoDBContainer mongoDbContainer() {
        MongoDBContainer mongoDbContainer = new MongoDBContainer(DockerImageName.parse("mongo:latest"))
                .withReuse(true)
                .waitingFor(Wait.forListeningPort());
        mongoDbContainer.start();
        return mongoDbContainer;
    }
}
