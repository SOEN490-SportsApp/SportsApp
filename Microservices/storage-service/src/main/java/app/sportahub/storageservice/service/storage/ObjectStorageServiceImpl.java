package app.sportahub.storageservice.service.storage;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.exception.storage.FileCannotBeNullException;
import app.sportahub.storageservice.utils.MimeTypeUtil;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.ErrorResponseException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ObjectStorageServiceImpl implements ObjectStorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String BUCKET_NAME;

    /**
     * Stores a file in MinIO and returns its metadata.
     * The file is stored under the authenticated user's directory with a unique name.
     *
     * @param file The file to be stored.
     * @return Metadata including file name, content type, size, and storage path.
     * @throws FileCannotBeNullException if the file is null or empty.
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

    /**
     * Retrieves a file from MinIO and returns it as a byte array.
     * Sets headers to display images inline and prompt download for other file types.
     *
     * @param filePath The file path in MinIO storage.
     * @return ResponseEntity with the file content and headers.
     */
    @Override
    public ResponseEntity<byte[]> getFile(String filePath) {
        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(BUCKET_NAME)
                        .object(filePath)
                        .build())) {

            byte[] fileBytes = stream.readAllBytes();
            stream.close();

            String mimeType = MimeTypeUtil.getMimeTypeFromExtension(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

            if (mimeType.startsWith("image/")) {
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
            } else {
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"");
            }

            return ResponseEntity.ok().headers(headers).body(fileBytes);
        } catch (ErrorResponseException e) {
            return ResponseEntity.status(e.response().code()).build();
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
