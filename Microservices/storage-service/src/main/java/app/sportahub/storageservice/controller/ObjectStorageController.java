package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.service.storage.ObjectStorageService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;

@RestController
@RequestMapping("/objects")
@RequiredArgsConstructor
public class ObjectStorageController {

    private final ObjectStorageService objectStorageService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Uploads a file", description = "Uploads a file to MinIO and returns metadata including the public download URL.")
    public ObjectStorageResponse uploadFile(@RequestParam("file") MultipartFile file) {
        return objectStorageService.storeFile(file);
    }

    @GetMapping("file/**")
    public ResponseEntity<byte[]> getFile(HttpServletRequest request) {
        // Extract the remaining part of the URL path after "/objects"
        String pathWithinHandlerMapping = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        // Use AntPathMatcher to capture the file path correctly
        String filePath = new AntPathMatcher().extractPathWithinPattern(bestMatchingPattern, pathWithinHandlerMapping);

        return objectStorageService.getFile(filePath);
    }
}
