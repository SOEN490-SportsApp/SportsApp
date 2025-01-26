package app.sportahub.userservice.response.badge;

import app.sportahub.userservice.dto.response.user.badge.BadgeResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BadgeResponseTest {

    @Test
    public void testBadgeResponse() {
        BadgeResponse badgeResponse = new BadgeResponse("Achiever", "Awarded for achievements", "url/to/icon");
        assertEquals("Achiever", badgeResponse.name());
        assertEquals("Awarded for achievements", badgeResponse.description());
        assertEquals("url/to/icon", badgeResponse.iconUrl());
    }
}
