package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ObjectStorageServiceImplTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private ObjectStorageServiceImpl objectStorageService;

    @BeforeEach
    void setUp() {
        setPrivateField(objectStorageService, "BUCKET_NAME", "test-bucket");
    }

    @Test
    public void testStoreFileShouldReturnMetadataWithCorrectMimeType() throws Exception {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                "testfile.jpg",
                "image/jpeg",
                "test data".getBytes()
        );

        // Mock authentication
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testUser");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Mock MinIO putObject() using doAnswer()
        doAnswer(invocation -> null).when(minioClient).putObject(any(PutObjectArgs.class));

        ArgumentCaptor<PutObjectArgs> putObjectArgsCaptor = ArgumentCaptor.forClass(PutObjectArgs.class);

        // Act
        ObjectStorageResponse result = objectStorageService.storeFile(file);

        // Verify interaction with MinIO
        verify(minioClient).putObject(putObjectArgsCaptor.capture());
        PutObjectArgs capturedArgs = putObjectArgsCaptor.getValue();

        // Assertions
        assertNotNull(result);
        assertTrue(result.fileName().endsWith("testfile.jpg"));
        assertEquals("image/jpeg", result.contentType());
        assertEquals(file.getSize(), result.size());
        assertEquals("/testUser/" + result.fileName(), result.downloadPath());
        assertEquals("image/jpeg", capturedArgs.contentType());
    }

    @Test
    public void testGetFileShouldReturnFileWithCorrectHeaders() throws Exception {
        // Arrange
        String filePath = "testUser/testfile.jpg";
        byte[] fileBytes = "dummy file content".getBytes();

        // Mock MinIO GetObjectResponse
        GetObjectResponse mockResponse = mock(GetObjectResponse.class);
        when(mockResponse.readAllBytes()).thenReturn(fileBytes);
        when(minioClient.getObject(any(GetObjectArgs.class))).thenReturn(mockResponse);

        // Act
        ResponseEntity<byte[]> response = objectStorageService.getFile(filePath);

        // Verify MinIO interaction
        verify(minioClient).getObject(any(GetObjectArgs.class));

        // Assertions
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(fileBytes, response.getBody());

        HttpHeaders headers = response.getHeaders();
        assertEquals("image/jpeg", headers.getFirst(HttpHeaders.CONTENT_TYPE));
        assertEquals("inline", headers.getFirst(HttpHeaders.CONTENT_DISPOSITION));
    }

    @Test
    public void testGetFileShouldReturnFileAsAttachmentForNonImageTypes() throws Exception {
        // Arrange
        String filePath = "testUser/document.pdf";
        byte[] fileBytes = "PDF content".getBytes();

        // Mock MinIO GetObjectResponse
        GetObjectResponse mockResponse = mock(GetObjectResponse.class);
        when(mockResponse.readAllBytes()).thenReturn(fileBytes);
        when(minioClient.getObject(any(GetObjectArgs.class))).thenReturn(mockResponse);

        // Act
        ResponseEntity<byte[]> response = objectStorageService.getFile(filePath);

        // Verify MinIO interaction
        verify(minioClient).getObject(any(GetObjectArgs.class));

        // Assertions
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(fileBytes, response.getBody());

        HttpHeaders headers = response.getHeaders();
        assertEquals("application/pdf", headers.getFirst(HttpHeaders.CONTENT_TYPE));
        assertTrue(headers.getFirst(HttpHeaders.CONTENT_DISPOSITION).startsWith("attachment"));
    }

    @Test
    public void testStoreFileNullFileShouldThrowFileCannotBeNullException() {
        assertThrows(FileCannotBeNullException.class, () -> objectStorageService.storeFile(null));
    }

    @Test
    public void testStoreFileEmptyFileShouldThrowFileCannotBeNullException() {
        MultipartFile emptyFile = new MockMultipartFile(
                "file",
                "emptyfile.txt",
                "text/plain",
                new byte[0]
        );
        assertThrows(FileCannotBeNullException.class, () -> objectStorageService.storeFile(emptyFile));
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
