package app.sportahub.storageservice.service;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ObjectStorageServiceImpl implements ObjectStorageService {
    private final MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String BUCKET_NAME;

    @Value("${minio.url.public}")
    private String minioPublicUrl;

    /**
     * Stores a file in MinIO storage and returns the ObjectResponse.
     *
     * @param file The MultipartFile to be stored.
     * @return The ObjectResponse containing file details and download URL.
     */
    @SneakyThrows
    @Override
    public ObjectResponse storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileCannotBeNullException();
        }

        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(BUCKET_NAME)
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());

        String downloadUrl = String.format("%s/%s/%s", minioPublicUrl, BUCKET_NAME, fileName);

        return new ObjectResponse(
                fileName,
                file.getContentType(),
                file.getSize(),
                LocalDateTime.now(),
                downloadUrl
        );
    }
}
