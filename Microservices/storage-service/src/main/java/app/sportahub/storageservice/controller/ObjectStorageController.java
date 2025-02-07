package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.model.MinioObjectMetadata;
import app.sportahub.storageservice.service.ObjectStorageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/objects")
@RequiredArgsConstructor
public class ObjectStorageController {
    private final ObjectStorageService objectStorageService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new event",
            description = "Creates a new event resource to the database based on the provided event details.")
    public ObjectResponse uploadFile(@RequestParam("file") MultipartFile file) {
        MinioObjectMetadata minioObjectMetadataInfo = objectStorageService.storeFile(file);
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/objects/download/")
                .path(minioObjectMetadataInfo.getFileName())
                .toUriString();

        return new ObjectResponse(file.getName(), file.getContentType(), file.getSize(), LocalDateTime.now(), downloadUrl);
    }
}
