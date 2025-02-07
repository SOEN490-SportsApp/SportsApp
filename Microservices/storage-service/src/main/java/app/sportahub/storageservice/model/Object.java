package app.sportahub.storageservice.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.io.InputStream;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper=false)
@SuperBuilder(toBuilder = true, setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class Object {
    @NotBlank(message = "File name must be provided")
    private String fileName;

    @NotBlank(message = "Content type must be provided")
    private String contentType;

    private long size;
    private InputStream contentStream;
    private String downloadUrl;

    @Builder.Default
    private LocalDateTime uploadTime = LocalDateTime.now();

}
