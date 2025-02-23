package app.sportahub.storageservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ObjectStorageResponse(String fileName, String ownerId, String contentType, long size, String downloadUrl) {
}
