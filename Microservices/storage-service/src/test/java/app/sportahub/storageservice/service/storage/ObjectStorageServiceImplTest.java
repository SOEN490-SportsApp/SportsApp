package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import app.sportahub.storageservice.service.ObjectStorageServiceImpl;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ObjectStorageServiceImplTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private ObjectStorageServiceImpl objectService;

    @BeforeEach
    void setUp() {
        setPrivateField(objectService, "BUCKET_NAME", "test-bucket");
        setPrivateField(objectService, "minioPublicUrl", "https://test.minio.com");
    }

    @Test
    public void testStoreFileShouldReturnSuccess() throws Exception {
        MultipartFile file = new MockMultipartFile(
                "file",
                "testfile.txt",
                "text/plain",
                "test data".getBytes()
        );

        ArgumentCaptor<PutObjectArgs> putObjectArgsCaptor = ArgumentCaptor.forClass(PutObjectArgs.class);

        doAnswer(invocation -> null).when(minioClient).putObject(any(PutObjectArgs.class));

        ObjectResponse result = objectService.storeFile(file);

        verify(minioClient, times(1)).putObject(putObjectArgsCaptor.capture());

        // Capture arguments
        PutObjectArgs capturedArgs = putObjectArgsCaptor.getValue();

        assertNotNull(result);
        assertEquals(capturedArgs.object(), result.fileName());
        assertEquals(file.getContentType(), result.contentType());
        assertEquals(file.getSize(), result.size());
        assertTrue(result.downloadUrl().startsWith("https://test.minio.com"));
    }


    @Test
    public void testStoreFile_NullFile_ShouldThrowFileCannotBeNullException() {
        assertThrows(FileCannotBeNullException.class, () -> objectService.storeFile(null));
    }

    @Test
    public void testStoreFile_EmptyFile_ShouldThrowFileCannotBeNullException() {
        MultipartFile emptyFile = new MockMultipartFile(
                "file",
                "emptyfile.txt",
                "text/plain",
                new byte[0]
        );

        assertThrows(FileCannotBeNullException.class, () -> objectService.storeFile(emptyFile));
    }

    private void setPrivateField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field: " + fieldName, e);
        }
    }
}
