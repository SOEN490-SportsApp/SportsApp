package app.sportahub.storageservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ObjectResponse(String fileName, String contentType, long size, LocalDateTime uploadTime,
                             String downloadUrl){
}
