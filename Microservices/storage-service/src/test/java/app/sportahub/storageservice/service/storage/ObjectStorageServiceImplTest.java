package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import app.sportahub.storageservice.model.MinioObjectMetadata;
import app.sportahub.storageservice.service.ObjectStorageServiceImpl;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class ObjectStorageServiceImplTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private ObjectStorageServiceImpl objectService;

    @Test
    public void testStoreFileShouldReturnSuccess() throws Exception {
        MultipartFile file = new MockMultipartFile(
                "file",
                "testfile.txt",
                "text/plain",
                "test data".getBytes());

        ArgumentCaptor<PutObjectArgs> putObjectArgsCaptor = ArgumentCaptor.forClass(PutObjectArgs.class);
        when(minioClient.putObject(putObjectArgsCaptor.capture())).thenReturn(null);

        MinioObjectMetadata result = objectService.storeFile(file);

        assertNotNull(result);
        PutObjectArgs capturedArgs = putObjectArgsCaptor.getValue();
        assertEquals(capturedArgs.object(), result.getFileName());
        assertEquals(file.getContentType(), result.getContentType());
        assertEquals(file.getSize(), result.getSize());
    }

    @Test
    public void testStoreFile_NullFile_ThrowsIllegalArgumentException() {
        assertThrows(FileCannotBeNullException.class, () -> objectService.storeFile(null));
    }
}
