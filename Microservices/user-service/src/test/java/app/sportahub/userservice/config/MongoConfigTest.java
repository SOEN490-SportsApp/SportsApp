package app.sportahub.userservice.config;

import com.mongodb.Block;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.connection.ConnectionPoolSettings;
import com.mongodb.connection.SocketSettings;
import lombok.SneakyThrows;
import org.bson.UuidRepresentation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.stubbing.Answer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.test.context.TestPropertySource;

import java.lang.reflect.Field;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.mockito.Mockito.*;

@SpringBootTest
@TestPropertySource(properties = "spring.data.mongodb.uri=mongodb://root:password@localhost:27017/user-service?authSource=admin")
public class MongoConfigTest {

    @Mock
    private MongoClient mongoClientMock;

    @Captor
    private ArgumentCaptor<Block<ConnectionPoolSettings.Builder>> poolSettingsCaptor;

    @Captor
    private ArgumentCaptor<Block<SocketSettings.Builder>> socketSettingsCaptor;

    private MongoConfig mongoConfig;
    private AutoCloseable mockitoAnnotations;
    private MockedStatic<MongoClients> mongoClientsStaticMock;

    @BeforeEach
    @SneakyThrows
    public void setUp() {
        mockitoAnnotations = MockitoAnnotations.openMocks(this);
        mongoClientsStaticMock = mockStatic(MongoClients.class);
        mongoClientsStaticMock.when(() -> MongoClients.create(any(MongoClientSettings.class)))
                .thenAnswer((Answer<MongoClient>) invocation -> mongoClientMock);
        mongoConfig = new MongoConfig();
        mongoConfig.mongoUri = "mongodb://localhost:27017/sportahub";
    }

    @SneakyThrows
    @AfterEach
    public void tearDown() {
        if (mongoClientsStaticMock != null) {
            mongoClientsStaticMock.close();
        }
        mockitoAnnotations.close();
    }

    @Test
    public void shouldCreateMongoClientWithExpectedSettings() {
        // Spy on MongoClientSettings.builder() call within mongoConfig.mongoClient()
        MongoClientSettings.Builder builderSpy = spy(MongoClientSettings.builder());

        try (var builderStaticMock = mockStatic(MongoClientSettings.class)) {
            builderStaticMock.when(MongoClientSettings::builder).thenReturn(builderSpy);

            // Act: Call mongoClient() to trigger the configuration
            MongoClient mongoClient = mongoConfig.mongoClient();

            Assertions.assertNotNull(mongoClient);

            // Verify that settings are applied on the builderSpy
            verify(builderSpy).retryWrites(true);
            verify(builderSpy).applicationName("user-service");
            verify(builderSpy).uuidRepresentation(UuidRepresentation.STANDARD);

            // Capture and verify Connection Pool Settings
            verify(builderSpy).applyToConnectionPoolSettings(poolSettingsCaptor.capture());
            ConnectionPoolSettings.Builder poolSettingsBuilder = mock(ConnectionPoolSettings.Builder.class);

            // Set up chaining for ConnectionPoolSettings.Builder
            when(poolSettingsBuilder.minSize(anyInt())).thenReturn(poolSettingsBuilder);
            when(poolSettingsBuilder.maxSize(anyInt())).thenReturn(poolSettingsBuilder);
            when(poolSettingsBuilder.maxConnectionLifeTime(anyLong(), any(TimeUnit.class))).thenReturn(poolSettingsBuilder);
            when(poolSettingsBuilder.maxConnectionIdleTime(anyLong(), any(TimeUnit.class))).thenReturn(poolSettingsBuilder);

            // Apply the captured settings to the mock
            poolSettingsCaptor.getValue().apply(poolSettingsBuilder);

            // Verify pool settings configuration
            verify(poolSettingsBuilder).minSize(5);
            verify(poolSettingsBuilder).maxSize(100);
            verify(poolSettingsBuilder).maxConnectionLifeTime(30, TimeUnit.MINUTES);
            verify(poolSettingsBuilder).maxConnectionIdleTime(10, TimeUnit.MINUTES);

            // Capture and verify Socket Settings
            verify(builderSpy).applyToSocketSettings(socketSettingsCaptor.capture());
            SocketSettings.Builder socketSettingsBuilder = mock(SocketSettings.Builder.class);

            // Set up chaining for SocketSettings.Builder
            when(socketSettingsBuilder.connectTimeout(anyLong(), any(TimeUnit.class))).thenReturn(socketSettingsBuilder);
            when(socketSettingsBuilder.readTimeout(anyLong(), any(TimeUnit.class))).thenReturn(socketSettingsBuilder);

            // Apply the captured settings to the mock
            socketSettingsCaptor.getValue().apply(socketSettingsBuilder);

            // Verify socket settings configuration
            verify(socketSettingsBuilder).connectTimeout(10, TimeUnit.SECONDS);
            verify(socketSettingsBuilder).readTimeout(10, TimeUnit.SECONDS);
        }
    }

    @Test
    public void shouldGetDatabaseName() {
        String databaseName = mongoConfig.getDatabaseName();

        Assertions.assertEquals("user-service", databaseName, "The database name should be 'user-service'");
    }

    @SneakyThrows
    @Test
    public void shouldGetAllCustomConversions() {
        MongoCustomConversions conversions = mongoConfig.customConversions();

        // Use reflection to access the private `converters` field
        // in the super class ("CustomConversions") of MongoCustomConversions.
        Field convertersField = MongoCustomConversions.class.getSuperclass().getDeclaredField("converters");
        convertersField.setAccessible(true);

        List<?> converters = (List<?>) convertersField.get(conversions);

        Assertions.assertNotNull(converters, "Converters list should not be null");

        Assertions.assertTrue(converters.stream()
                        .anyMatch(c -> c instanceof MongoConfig.LocalDateToDateConverter),
                "LocalDateToDateConverter should be present");
        Assertions.assertTrue(converters.stream()
                        .anyMatch(c -> c instanceof MongoConfig.DateToLocalDateConverter),
                "DateToLocalDateConverter should be present");
        Assertions.assertTrue(converters.stream()
                        .anyMatch(c -> c instanceof MongoConfig.LocalDateTimeToDateConverter),
                "LocalDateTimeToDateConverter should be present");
        Assertions.assertTrue(converters.stream()
                        .anyMatch(c -> c instanceof MongoConfig.DateToLocalDateTimeConverter),
                "DateToLocalDateTimeConverter should be present");
        Assertions.assertTrue(converters.stream()
                        .anyMatch(c -> c instanceof MongoConfig.TimestampToDateConverter),
                "TimestampToDateConverter should be present");
        Assertions.assertTrue(converters.stream().
                        anyMatch(c -> c instanceof MongoConfig.DateToTimestampConverter),
                "DateToTimestampConverter should be present");
    }
}
