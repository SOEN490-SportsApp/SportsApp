package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.model.Object;
import app.sportahub.storageservice.service.ObjectService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/objects")
@RequiredArgsConstructor
public class ObjectController {
    private final ObjectService objectService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new event",
            description = "Creates a new event resource to the database based on the provided event details.")
    public ResponseEntity<Object> uploadFile(@RequestParam("file") MultipartFile file) {
        Object objectInfo = objectService.storeFile(file);
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/objects/download/")
                .path(objectInfo.getFileName())
                .toUriString();

        objectInfo.setDownloadUrl(downloadUrl);
        return ResponseEntity.ok(objectInfo);
    }

    @GetMapping("/download/{fileName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Download Object using URL",
            description = "Downloads the desired object using the URL returned when uploading object.")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileName) {
        Object objectInfo = objectService.retrieveFile(fileName);
        if (objectInfo.getContentStream() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(objectInfo.getContentType()))
                .body(new InputStreamResource(objectInfo.getContentStream()));
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) {
        objectService.deleteFile(fileName);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Object>> listAllFiles() {
        List<Object> objects = objectService.listAllFiles();
        return ResponseEntity.ok(objects);
    }
}
