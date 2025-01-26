package app.sportahub.userservice.response.friend;

import app.sportahub.userservice.dto.response.user.friend.FriendRequestResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
public class FriendRequestResponseTest {

    @Test
    public void testFriendRequestResponse() {
        FriendRequestResponse friendRequestResponse = new FriendRequestResponse("Request sent successfully", "req123");
        assertEquals("Request sent successfully", friendRequestResponse.message());
        assertEquals("req123", friendRequestResponse.RequestId());
    }

}
