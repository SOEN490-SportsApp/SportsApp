package app.sportahub.storageservice.config.utils;

import eu.medsea.mimeutil.MimeUtil;
import eu.medsea.mimeutil.detector.MagicMimeMimeDetector;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MimeUtilConfig {

    static {
        MimeUtil.registerMimeDetector(MagicMimeMimeDetector.class.getName());
    }

    @Bean
    public MagicMimeMimeDetector mimeUtil() {
        return new MagicMimeMimeDetector();
    }
}
