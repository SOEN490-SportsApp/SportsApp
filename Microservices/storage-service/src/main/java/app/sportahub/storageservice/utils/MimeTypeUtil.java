package app.sportahub.storageservice.utils;

import java.util.Map;

/**
 * Utility class for determining MIME types based on file extensions.
 * Provides a mapping of common file extensions to their respective MIME types.
 */
public class MimeTypeUtil {

    /**
     * A static map containing file extensions and their corresponding MIME types.
     */
    private static final Map<String, String> MIME_TYPE_MAP = Map.ofEntries(
            Map.entry("jpg", "image/jpeg"),
            Map.entry("jpeg", "image/jpeg"),
            Map.entry("png", "image/png"),
            Map.entry("gif", "image/gif"),
            Map.entry("bmp", "image/bmp"),
            Map.entry("webp", "image/webp"),
            Map.entry("svg", "image/svg+xml"),
            Map.entry("pdf", "application/pdf"),
            Map.entry("txt", "text/plain"),
            Map.entry("mp4", "video/mp4"),
            Map.entry("mp3", "audio/mpeg"),
            Map.entry("json", "application/json")
    );

    /**
     * Determines the MIME type of a file based on its extension.
     *
     * @param fileName The name of the file, including its extension.
     * @return The corresponding MIME type if found; otherwise, "application/octet-stream".
     */
    public static String getMimeTypeFromExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "application/octet-stream"; // Default MIME type for unknown files
        }

        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return MIME_TYPE_MAP.getOrDefault(extension, "application/octet-stream");
    }
}
