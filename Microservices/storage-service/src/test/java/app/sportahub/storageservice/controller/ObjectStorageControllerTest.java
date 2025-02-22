package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.service.ObjectStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ObjectStorageControllerTest {

    @Mock
    private ObjectStorageService objectStorageService;

    @InjectMocks
    private ObjectStorageController objectStorageController;

    @Test
    public void testUploadFileWhenCallsService() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "filename.txt",
                "text/plain",
                "Hello, world!".getBytes()
        );

        ObjectResponse expectedResponse = new ObjectResponse(
                "filename.txt",
                "text/plain",
                file.getSize(),
                LocalDateTime.now(),
                "https://storage.sportahub.app/sports-app-bucket/filename.txt"
        );

        when(objectStorageService.storeFile(file)).thenReturn(expectedResponse);

        ObjectResponse actualResponse = objectStorageController.uploadFile(file);

        verify(objectStorageService).storeFile(file);

        assertNotNull(actualResponse);
        assertEquals(expectedResponse.fileName(), actualResponse.fileName());
        assertEquals(expectedResponse.contentType(), actualResponse.contentType());
        assertEquals(expectedResponse.size(), actualResponse.size());
        assertEquals(expectedResponse.downloadUrl(), actualResponse.downloadUrl());
    }
}
