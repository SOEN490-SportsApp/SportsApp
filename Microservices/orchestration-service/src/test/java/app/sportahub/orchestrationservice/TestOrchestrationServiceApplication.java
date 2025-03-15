package app.sportahub.orchestrationservice;

import org.springframework.boot.SpringApplication;

public class TestOrchestrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.from(OrchestrationServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
