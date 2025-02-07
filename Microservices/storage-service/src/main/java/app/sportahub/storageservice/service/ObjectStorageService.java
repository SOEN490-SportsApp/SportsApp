package app.sportahub.storageservice.service;

import app.sportahub.storageservice.model.MinioObjectMetadata;
import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {

    MinioObjectMetadata storeFile(MultipartFile file);
}
