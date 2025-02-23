package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.service.storage.ObjectStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ObjectStorageControllerTest {

    @Mock
    private ObjectStorageService objectStorageService;

    @InjectMocks
    private ObjectStorageController objectStorageController;

    @Test
    public void testUploadFileShouldCallServiceAndReturnResponse() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "testfile.png",
                "image/png",
                "test data".getBytes()
        );

        ObjectStorageResponse expectedResponse = new ObjectStorageResponse(
                "testfile.png",
                "testUser",
                "image/png",
                file.getSize(),
                "testUser/testfile.png"
        );

        when(objectStorageService.storeFile(file)).thenReturn(expectedResponse);

        ObjectStorageResponse actualResponse = objectStorageController.uploadFile(file);

        verify(objectStorageService).storeFile(file);
        assertNotNull(actualResponse);
        assertEquals(expectedResponse.fileName(), actualResponse.fileName());
        assertEquals(expectedResponse.contentType(), actualResponse.contentType());
        assertEquals(expectedResponse.size(), actualResponse.size());
        assertEquals(expectedResponse.downloadPath(), actualResponse.downloadPath());
    }

    @Test
    public void testGetFileShouldCallServiceAndReturnFileBytes() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/objects/testUser/testfile.png");
        request.setAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE, "/objects/**");

        byte[] fileBytes = "file content".getBytes();
        ResponseEntity<byte[]> expectedResponse = new ResponseEntity<>(fileBytes, HttpStatus.OK);

        when(objectStorageService.getFile("testUser/testfile.png")).thenReturn(expectedResponse);

        ResponseEntity<byte[]> actualResponse = objectStorageController.getFile(request);

        verify(objectStorageService).getFile("testUser/testfile.png");
        assertNotNull(actualResponse);
        assertEquals(HttpStatus.OK, actualResponse.getStatusCode());
        assertArrayEquals(fileBytes, actualResponse.getBody());
    }
}
