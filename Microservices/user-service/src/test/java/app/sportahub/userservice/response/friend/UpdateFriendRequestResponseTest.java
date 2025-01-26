package app.sportahub.userservice.response.friend;

import app.sportahub.userservice.dto.response.user.friend.UpdateFriendRequestResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
public class UpdateFriendRequestResponseTest {

    @Test
    public void testUpdateFriendRequestResponse() {
        UpdateFriendRequestResponse response = new UpdateFriendRequestResponse("Request updated successfully");
        assertEquals("Request updated successfully", response.message());
    }
}
