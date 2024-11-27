package app.sportahub.emailservice;

import org.springframework.boot.SpringApplication;

public class TestEmailserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(EmailserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
