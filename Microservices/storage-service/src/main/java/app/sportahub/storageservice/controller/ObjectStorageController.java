package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.service.ObjectStorageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/objects")
@RequiredArgsConstructor
public class ObjectStorageController {
    private final ObjectStorageService objectStorageService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Uploads a file",
            description = "Uploads a file to MinIO and returns metadata including the public download URL.")
    public ObjectResponse uploadFile(@RequestParam("file") MultipartFile file) {
        return objectStorageService.storeFile(file);
    }
}
