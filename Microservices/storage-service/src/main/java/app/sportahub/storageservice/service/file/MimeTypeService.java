package app.sportahub.storageservice.service.file;

import java.io.InputStream;

public interface MimeTypeService {
    String getMimeTypeFromInputStream(InputStream inputStream);
}
