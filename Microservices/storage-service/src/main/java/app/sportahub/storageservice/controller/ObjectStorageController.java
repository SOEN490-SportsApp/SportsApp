package app.sportahub.storageservice.controller;

import app.sportahub.storageservice.dto.response.ObjectStorageResponse;
import app.sportahub.storageservice.service.storage.ObjectStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Object Storage API", description = "API for uploading and retrieving files from the storage service.")
public class ObjectStorageController {

    private final ObjectStorageService objectStorageService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Uploads a file", description = "Uploads a file to MinIO and returns metadata including the public download URL.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "File uploaded successfully", content = @Content(schema = @Schema(implementation = ObjectStorageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid file provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ObjectStorageResponse uploadFile(
            @Parameter(description = "The file to be uploaded", example = "file", required = true)
            @RequestParam("file") MultipartFile file
    ) {
        return objectStorageService.storeFile(file);
    }

    @GetMapping("/file/**")
    @Operation(summary = "Retrieves a file", description = "Fetches a file from storage using the given file path. Replace the `**` with the file path.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "File retrieved successfully", content = @Content(mediaType = "application/octet-stream")),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<byte[]> getFile(
            @Parameter(description = "Path to the file", example = "folder/subfolder/file.txt")
            HttpServletRequest request
    ) {
        String pathWithinHandlerMapping = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String filePath = new AntPathMatcher().extractPathWithinPattern(bestMatchingPattern, pathWithinHandlerMapping);
        return objectStorageService.getFile(filePath);
    }
}
