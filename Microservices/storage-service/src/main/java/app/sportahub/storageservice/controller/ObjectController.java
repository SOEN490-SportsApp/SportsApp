package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectResponse;
import app.sportahub.storageservice.model.Object;
import app.sportahub.storageservice.service.ObjectService;
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
public class ObjectController {
    private final ObjectService objectService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new event",
            description = "Creates a new event resource to the database based on the provided event details.")
    public ObjectResponse uploadFile(@RequestParam("file") MultipartFile file) {
        Object objectInfo = objectService.storeFile(file);
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/objects/download/")
                .path(objectInfo.getFileName())
                .toUriString();

        return new ObjectResponse(file.getName(), file.getContentType(), file.getSize(), LocalDateTime.now(), downloadUrl);
    }
}
