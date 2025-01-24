package app.sportahub.userservice.utils;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    @Test
    public void decodePayloadShouldDecodeSuccessfully() {
        String payloadJson = "{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"admin\":true}";
        String base64Payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes());
        String token = "header." + base64Payload + ".signature";

        JsonNode payload = JwtUtils.decodePayload(token);
        assertNotNull(payload, "Payload should not be null.");
        assertEquals("John Doe", payload.get("name").asText(), "Names should match.");
        assertTrue(payload.get("admin").asBoolean(), "Admin claim should be true.");
    }

    @Test
    public void decodePayloadWithInvalidTokenFormatShouldThrowException() {
        String invalidToken = "header.signature"; 
        assertThrows(IllegalArgumentException.class, () -> JwtUtils.decodePayload(invalidToken),
                "Should throw IllegalArgumentException for invalid token format.");
    }

    @Test
    public void getClaimShouldRetrieveClaimSuccessfully() {
        String payloadJson = "{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"admin\":true}";
        String base64Payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes());
        String token = "header." + base64Payload + ".signature";

        JsonNode claim = JwtUtils.getClaim(token, "name");
        assertNotNull(claim, "Claim should not be null.");
        assertEquals("John Doe", claim.asText(), "Claim value should match.");
    }

    @Test
    public void getClaimWithNonexistentClaim_ShouldReturnNull() {
        String payloadJson = "{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"admin\":true}";
        String base64Payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes());
        String token = "header." + base64Payload + ".signature";

        JsonNode claim = JwtUtils.getClaim(token, "email");
        assertNull(claim, "Non-existent claim should return null.");
    }
}
