package app.sportahub.storageservice.service.file;

import eu.medsea.mimeutil.MimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collection;

@Slf4j
@Service
public class MimeTypeServiceImpl implements MimeTypeService {

    @Override
    public String getMimeTypeFromInputStream(InputStream inputStream) {
        try {
            if (!inputStream.markSupported()) {
                log.warn("InputStream does not support mark and reset, unable to determine MIME type without closing the stream");
                return "application/octet-stream";
            }

            inputStream.mark(1024 * 1024);

            Collection<?> mimeTypes = MimeUtil.getMimeTypes(inputStream);

            inputStream.reset();

            if (!mimeTypes.isEmpty()) {
                return mimeTypes.iterator().next().toString();
            } else {
                return "application/octet-stream";
            }
        } catch (Exception e) {
            log.error("MimeTypeServiceImpl::getMimeTypeFromInputStream: error={}", e.getMessage());
            return "application/octet-stream";
        }
    }
}
