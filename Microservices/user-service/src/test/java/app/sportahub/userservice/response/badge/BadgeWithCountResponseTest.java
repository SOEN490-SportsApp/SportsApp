package app.sportahub.userservice.response.badge;

import app.sportahub.userservice.dto.response.user.badge.BadgeResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class BadgeWithCountResponseTest {

    @Test
    public void testBadgeWithCountResponse() {
        BadgeResponse badge = new BadgeResponse("Leader", "Leads teams", "url/to/leader/icon");
        BadgeWithCountResponse badgeWithCountResponse = new BadgeWithCountResponse(badge, 5);

        assertEquals("Leader", badgeWithCountResponse.badge().name());
        assertEquals(5, badgeWithCountResponse.badgeCount().intValue());
    }
}
