package app.sportahub.userservice.response.friend;

import app.sportahub.userservice.dto.response.user.friend.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ViewFriendRequestsResponseTest {

    @Test
    public void testViewFriendRequestsResponse() {
        ViewFriendRequestsResponse response = new ViewFriendRequestsResponse("JaneDoe", "user123", FriendRequestStatusEnum.ACCEPTED, "fr123");
        assertEquals("JaneDoe", response.friendUsername());
        assertEquals("user123", response.friendUserId());
        assertEquals(FriendRequestStatusEnum.ACCEPTED, response.status());
        assertEquals("fr123", response.id());
    }
}
