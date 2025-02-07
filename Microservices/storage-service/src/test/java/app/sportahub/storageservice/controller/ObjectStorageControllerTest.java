package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.model.MinioObjectMetadata;
import app.sportahub.storageservice.service.ObjectStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ObjectStorageControllerTest {

    @Mock
    private ObjectStorageService objectStorageService;

    @InjectMocks
    private ObjectStorageController objectStorageController;

    @Test
    public void testUploadFileWhenCallsService() {
        try (MockedStatic<ServletUriComponentsBuilder> mockedBuilder = mockStatic(ServletUriComponentsBuilder.class)) {
            ServletUriComponentsBuilder uriBuilder = mock(ServletUriComponentsBuilder.class, RETURNS_SELF);

            mockedBuilder.when(ServletUriComponentsBuilder::fromCurrentContextPath).thenReturn(uriBuilder);
            when(uriBuilder.path(anyString())).thenReturn(uriBuilder);

            MultipartFile file = new MockMultipartFile(
                    "file",
                    "filename.txt",
                    "text/plain",
                    "Hello, world!".getBytes());
            MinioObjectMetadata metadata = MinioObjectMetadata.builder()
                    .withFileName("filename.txt")
                    .withContentType("text/plain")
                    .withSize(file.getSize())
                    .build();
            when(objectStorageService.storeFile(file)).thenReturn(metadata);

            objectStorageController.uploadFile(file);

            verify(objectStorageService).storeFile(file);
        }
    }
}
