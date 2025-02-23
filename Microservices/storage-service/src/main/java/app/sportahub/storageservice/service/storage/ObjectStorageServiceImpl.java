package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import app.sportahub.storageservice.service.file.MimeTypeService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class ObjectStorageServiceImpl implements ObjectStorageService {

    private final MimeTypeService mimeTypeService;

    private final MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String BUCKET_NAME;

    /**
     * Stores a file in MinIO storage and returns the ObjectResponse.
     *
     * @param file The MultipartFile to be stored.
     * @return The ObjectResponse containing file details and download URL.
     */
    @SneakyThrows
    @Override
    public ObjectStorageResponse storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileCannotBeNullException();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        String filePath = "/" + authentication.getName() + "/" + fileName;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(BUCKET_NAME)
                        .object(filePath) // Create a folder with the user's id
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());

        return new ObjectStorageResponse(fileName, authentication.getName(), file.getContentType(), file.getSize(), filePath);
    }

    @SneakyThrows
    @Override
    public ResponseEntity<byte[]> getFile(String filePath) {
        InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(BUCKET_NAME)
                        .object(filePath)
                        .build());

        String mimeType = mimeTypeService.getMimeTypeFromInputStream(stream);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

        if (mimeType.startsWith("image/")) {
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
        } else {
            headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"");
        }

        return new ResponseEntity<>(stream.readAllBytes(), headers, HttpStatus.OK);
    }
}
