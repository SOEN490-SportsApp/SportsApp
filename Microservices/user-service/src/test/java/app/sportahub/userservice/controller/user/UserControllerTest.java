package app.sportahub.userservice.controller.user;

import app.sportahub.userservice.config.auth.TestSecurityConfig;
import app.sportahub.userservice.controller.user.UserController;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.request.user.friend.FriendRequestRequest;
import app.sportahub.userservice.dto.request.user.friend.UpdateFriendRequestRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import app.sportahub.userservice.dto.response.user.friendRequest.FriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friendRequest.UpdateFriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friendRequest.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.enums.user.UpdateFriendRequestActionEnum;
import app.sportahub.userservice.exception.user.UserDoesNotExistException;
import app.sportahub.userservice.service.user.UserServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(UserController.class)
@Import({TestSecurityConfig.class, UserServiceImpl.class})
@ActiveProfiles("user-service.test")
public class UserControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    private UserServiceImpl userService;

    @Autowired
    private ObjectMapper objectMapper;

    @SneakyThrows
    @BeforeEach
    public void setUp() {
        UserRequest userRequest = new UserRequest("keycloakId", "user@example.com", "username",
                "password", null, null, null, null);
        UserResponse userResponse = new UserResponse("1", "keycloakId", "user@example.com",
                "username", null, null, null, null);
        when(userService.createUser(any())).thenReturn(userResponse);
        when(userService.getUserById("1")).thenReturn(userResponse);
        doThrow(new UserDoesNotExistException("User does not exist")).when(userService).getUserById("999");
    }

    @SneakyThrows
    @Test
    public void shouldCreateUserSuccessfully() {
        UserRequest userRequest = new UserRequest("keycloakId", "user@example.com", "username",
                "password", null, null, null, null);

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @SneakyThrows
    @Test
    public void shouldFetchUserSuccessfully() {
        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @SneakyThrows
    @Test
    public void getUserNotFound() {
        mockMvc.perform(get("/user/999"))
                .andExpect(status().isNotFound());
    }

    @SneakyThrows
    @Test
    public void updateUserProfileSuccessfully() {
        ProfileRequest profileRequest = new ProfileRequest("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");
        ProfileResponse expectedResponse = new ProfileResponse("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");
        when(userService.updateUserProfile("1", profileRequest)).thenReturn(expectedResponse);

        mockMvc.perform(put("/user/1/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @SneakyThrows
    @Test
    public void shouldPatchProfileSuccessfully() {
        ProfileRequest profileRequest = new ProfileRequest("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");
        ProfileResponse expectedResponse = new ProfileResponse("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");
        when(userService.patchUserProfile("1", profileRequest)).thenReturn(expectedResponse);

        mockMvc.perform(patch("/user/1/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));

    }

    @SneakyThrows
    @Test
    public void patchProfileUserNotFound() {
        ProfileRequest profileRequest = new ProfileRequest("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");
        doThrow(new UserDoesNotExistException("User does not exist"))
                .when(userService).patchUserProfile("999", profileRequest);

        mockMvc.perform(patch("/user/999/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileRequest)))
                .andExpect(status().isNotFound());
    }

    @SneakyThrows
    @Test
    public void assignBadgeSuccessfully() {
        UserResponse userResponse = new UserResponse("1", "keycloakId", "user@example.com",
                "username", null, null, null, null);
        when(userService.assignBadge("1", "badgeId", "giverId")).thenReturn(userResponse);

        mockMvc.perform(post("/user/1/badge")
                        .param("giverId", "giverId")
                        .param("badgeId", "badgeId"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @SneakyThrows
    @Test
    public void assignBadgeToNonexistentUser() {
        doThrow(new UserDoesNotExistException("User does not exist"))
                .when(userService).assignBadge("999", "badgeId", "giverId");

        mockMvc.perform(post("/user/999/badge")
                        .param("giverId", "giverId")
                        .param("badgeId", "badgeId"))
                .andExpect(status().isNotFound());
    }

    @SneakyThrows
    @Test
    public void getUserBadgeSuccessfully() {
        BadgeResponse badge = new BadgeResponse( "Name", "Team PLayer", "url");
        Integer badgeCount = 1;
        List<BadgeWithCountResponse> badgeResponses = new ArrayList<>();
        badgeResponses.add(new BadgeWithCountResponse(badge, badgeCount));
        when(userService.getUserBadges("999")).thenReturn(badgeResponses);

        mockMvc.perform(get("/user/999/badge"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].badgeCount").value(badgeCount));
    }

    @SneakyThrows
    @Test
    public void sendFriendRequestSuccessfully() {
        FriendRequestResponse friendRequestResponse = new FriendRequestResponse("Friend request sent", "req123");
        when(userService.sendFriendRequest("1", new FriendRequestRequest("2"))).thenReturn(friendRequestResponse);

        mockMvc.perform(post("/user/1/friends/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new FriendRequestRequest("2"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Friend request sent"));
    }

    @SneakyThrows
    @Test
    public void shouldFetchFriendRequestsSuccessfully() {
        List<FriendRequestStatusEnum> friendRequestStatusEnums = new ArrayList<>();
        friendRequestStatusEnums.add(FriendRequestStatusEnum.SENT);

        List<ViewFriendRequestsResponse> friendRequestResponse= new ArrayList<>();
        friendRequestResponse.add(new ViewFriendRequestsResponse("username1", "1", FriendRequestStatusEnum.SENT, "1"));

        when(userService.getFriendRequests("1", friendRequestStatusEnums)).thenReturn(friendRequestResponse);

        mockMvc.perform(get("/user/1/friend-requests")
                        .param("type", "SENT")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].friendRequestUsername").value("username1"))
                .andExpect(jsonPath("$[0].status").value("SENT"));
    }

    @SneakyThrows
    @Test
    public void getFriendRequestsUserNotFound() {
        List<FriendRequestStatusEnum> friendRequestStatusEnums = new ArrayList<>();
        friendRequestStatusEnums.add(FriendRequestStatusEnum.ACCEPTED);

        doThrow(new UserDoesNotExistException("User does not exist"))
                .when(userService).getFriendRequests("999", friendRequestStatusEnums);

        mockMvc.perform(get("/user/999/friend-requests")
                        .param("type", "ACCEPTED")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @SneakyThrows
    @Test
    public void shouldUpdateFriendRequestSuccessfully() {
        UpdateFriendRequestRequest request = new UpdateFriendRequestRequest("1",  UpdateFriendRequestActionEnum.ACCEPT);
        UpdateFriendRequestResponse response = new UpdateFriendRequestResponse("Request updated successfully");
        UpdateFriendRequestRequest  updateFriendRequestRequest = new UpdateFriendRequestRequest("1",  UpdateFriendRequestActionEnum.ACCEPT);
        when(userService.updateFriendRequest("1", "1", updateFriendRequestRequest)).thenReturn(response);

        mockMvc.perform(put("/user/1/friend-requests/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Request updated successfully"));
    }

    @SneakyThrows
    @Test
    public void searchUsersSuccessfully() {
        ProfileResponse profileResponse = new ProfileResponse("John", "Doe", null, "Male", "12345", "555-1234", null, "Amateur");

        List<UserProfileResponse> userProfiles = List.of(new UserProfileResponse("123abc", profileResponse));
        Page<UserProfileResponse> page = new PageImpl<>(userProfiles);

        when(userService.searchUsers("John", null, null, null, null, null, PageRequest.of(0, 10)))
                .thenReturn(page);

        mockMvc.perform(get("/user/search")
                        .param("firstName", "John")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userId").value("123abc"))
                .andExpect(jsonPath("$.content[0].profileResponse.firstName").value("John"));
    }

    @SneakyThrows
    @Test
    public void deleteUserSuccessfully() {
        mockMvc.perform(delete("/user/1"))
                .andExpect(status().isNoContent());
    }

    @SneakyThrows
    @Test
    public void deleteUserNotFound() {
        doThrow(new UserDoesNotExistException("User does not exist"))
                .when(userService).deleteUserById("999");

        mockMvc.perform(delete("/user/999"))
                .andExpect(status().isNotFound());
    }
}
