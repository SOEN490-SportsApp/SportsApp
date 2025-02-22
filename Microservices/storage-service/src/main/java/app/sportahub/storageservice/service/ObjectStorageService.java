package app.sportahub.storageservice.service;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {

    ObjectResponse storeFile(MultipartFile file);
}
