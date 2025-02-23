package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {

    ObjectStorageResponse storeFile(MultipartFile file);

    ResponseEntity<byte[]> getFile(String filePath);
}
