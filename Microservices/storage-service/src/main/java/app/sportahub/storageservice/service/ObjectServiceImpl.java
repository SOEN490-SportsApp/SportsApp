package app.sportahub.storageservice.service;

import app.sportahub.storageservice.exception.StorageException;
import app.sportahub.storageservice.model.Object;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import io.minio.GetObjectArgs;
import io.minio.errors.MinioException;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
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
     * @throws StorageException if there is an error during the file storage process such as an I/O error or issues with MinIO operations.
     */
    @SneakyThrows
    @Override
    public Object storeFile(MultipartFile file) {
        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        try {
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
        } catch (MinioException | java.io.IOException e) {
            throw new StorageException("Failed to store file", e);
        }
    }

    /**
     * Retrieves the file metadata and content stream for a given file name from MinIO storage.
     * This method fetches the file if it exists and provides a stream to access its content.
     *
     * @param fileName The name of the file to retrieve.
     * @return The Object containing the file's metadata and a stream of its content.
     * @throws StorageException if the file cannot be retrieved due to MinIO issues or I/O errors.
     */
    @SneakyThrows
    @Override
    public Object retrieveFile(String fileName) {
        try {
            GetObjectArgs args = GetObjectArgs.builder()
                    .bucket(BUCKET_NAME)
                    .object(fileName)
                    .build();

            InputStream stream = minioClient.getObject(args);

            Object objectInfo = Object.builder()
                    .withFileName(fileName)
                    .withContentType("application/octet-stream")
                    .withSize(stream.available())
                    .withContentStream(stream)
                    .build();

            return objectInfo;
        } catch (MinioException | java.io.IOException e) {
            throw new StorageException("Failed to retrieve file: " + fileName, e);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        // Implementation for file deletion
    }

    @Override
    public List<Object> listAllFiles() {
        // List all files in the bucket
        return new ArrayList<>();
    }
}
