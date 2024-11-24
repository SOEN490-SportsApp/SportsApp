package app.sportahub.userservice.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;

import java.util.Base64;

public class JwtUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Decodes the payload of a JWT token without verifying its signature.
     *
     * @param token the JWT token
     * @return a JsonNode representing the claims in the token payload
     */
    @SneakyThrows
    public static JsonNode decodePayload(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT token format.");
        }

        String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
        return objectMapper.readTree(payload);
    }

    /**
     * Retrieves a specific claim from the decoded JWT payload as a JsonNode.
     *
     * @param token    the JWT token
     * @param claimKey the key of the claim to retrieve
     * @return a JsonNode representing the claim value, or null if the claim does not exist
     */
    public static JsonNode getClaim(String token, String claimKey) {
        JsonNode payload = decodePayload(token);
        return payload.get(claimKey);
    }
}