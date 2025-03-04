package app.sportahub.storageservice.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MimeTypeUtilTest {

    @Test
    void testGetMimeTypeFromExtensionShouldReturnCorrectMimeType() {
        assertEquals("image/jpeg", MimeTypeUtil.getMimeTypeFromExtension("test.jpg"));
        assertEquals("image/jpeg", MimeTypeUtil.getMimeTypeFromExtension("test.jpeg"));
        assertEquals("image/png", MimeTypeUtil.getMimeTypeFromExtension("test.png"));
        assertEquals("image/gif", MimeTypeUtil.getMimeTypeFromExtension("test.gif"));
        assertEquals("image/bmp", MimeTypeUtil.getMimeTypeFromExtension("test.bmp"));
        assertEquals("image/webp", MimeTypeUtil.getMimeTypeFromExtension("test.webp"));
        assertEquals("image/svg+xml", MimeTypeUtil.getMimeTypeFromExtension("test.svg"));
        assertEquals("application/pdf", MimeTypeUtil.getMimeTypeFromExtension("document.pdf"));
        assertEquals("text/plain", MimeTypeUtil.getMimeTypeFromExtension("notes.txt"));
        assertEquals("video/mp4", MimeTypeUtil.getMimeTypeFromExtension("video.mp4"));
        assertEquals("audio/mpeg", MimeTypeUtil.getMimeTypeFromExtension("music.mp3"));
        assertEquals("application/json", MimeTypeUtil.getMimeTypeFromExtension("data.json"));
    }

    @Test
    void testGetMimeTypeFromExtensionShouldReturnDefaultForUnknownExtension() {
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension("unknown.xyz"));
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension("file.abc"));
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension("randomfile"));
    }

    @Test
    void testGetMimeTypeFromExtensionShouldReturnDefaultForNullOrEmptyInput() {
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension(null));
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension(""));
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension("."));
        assertEquals("application/octet-stream", MimeTypeUtil.getMimeTypeFromExtension("noextension."));
    }
}
