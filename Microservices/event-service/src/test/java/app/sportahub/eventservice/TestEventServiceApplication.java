package app.sportahub.eventservice;

import org.springframework.boot.SpringApplication;

public class TestEventServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(EventServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
