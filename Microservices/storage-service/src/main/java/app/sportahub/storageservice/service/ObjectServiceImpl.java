package app.sportahub.storageservice.service;

import app.sportahub.storageservice.model.Object;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
@RequiredArgsConstructor
public class ObjectServiceImpl implements ObjectService {
    private final MinioClient minioClient;
    private static final String BUCKET_NAME = "sports-app-bucket";

    /**
     * Stores a file in MinIO storage and returns the file metadata.
     * This method uploads a file and creates a corresponding object in the storage.
     *
     * @param file The MultipartFile to be stored.
     * @return The Object containing metadata about the stored file including file name, content type, and size.
     */
    @SneakyThrows
    @Override
    public Object storeFile(MultipartFile file) {
        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            minioClient.putObject(
                PutObjectArgs.builder().bucket(BUCKET_NAME).object(fileName).stream(
                                file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());
        return Object.builder()
                .withFileName(fileName)
                .withContentType(file.getContentType())
                .withSize(file.getSize())
                .build();
    }
}
