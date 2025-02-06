package app.sportahub.storageservice.service;

import app.sportahub.storageservice.model.Object;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ObjectService {

    Object storeFile(MultipartFile file);

    Object retrieveFile(String fileName);

    void deleteFile(String fileName);

    List<Object> listAllFiles();
}
