package app.sportahub.userservice;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "spring.data.mongodb.uri=mongodb://root:password@localhost:27017/user-service?authSource=admin")
public class UserServiceApplicationTests {

    @Test
    public void contextLoads() {
        Assertions.assertTrue(true, "Application context loaded successfully");
    }
}
