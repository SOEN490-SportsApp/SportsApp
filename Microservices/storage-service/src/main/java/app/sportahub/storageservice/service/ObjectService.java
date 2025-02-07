package app.sportahub.storageservice.service;

import app.sportahub.storageservice.model.Object;
import org.springframework.web.multipart.MultipartFile;

public interface ObjectService {

    Object storeFile(MultipartFile file);
}
