package app.sportahub.userservice.controller.user;

import app.sportahub.userservice.dto.request.user.friend.FriendRequestRequest;
import app.sportahub.userservice.dto.request.user.friend.UpdateFriendRequestRequest;
import app.sportahub.userservice.dto.response.user.friend.FriendRequestResponse;
import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import app.sportahub.userservice.dto.response.user.friend.UpdateFriendRequestResponse;
import app.sportahub.userservice.dto.response.user.friend.ViewFriendRequestsResponse;
import app.sportahub.userservice.enums.user.FriendRequestStatusEnum;
import app.sportahub.userservice.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Operations related to user management")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve user by ID",
            description = "Fetches a user by their unique identifier.")
    public UserResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Do not use this to register a user! Create a new user",
            description = "Creates a new user resource to the database based on the provided user details.")
    public UserResponse createUser(@Valid @RequestBody UserRequest userRequest) {
        return userService.createUser(userRequest);
    }

    @PutMapping("/{id}/profile")
    @ResponseStatus(HttpStatus.OK)
    public ProfileResponse updateProfile(@PathVariable String id, @Valid @RequestBody ProfileRequest profileRequest) {
        return userService.updateUserProfile(id, profileRequest);
    }

    @PatchMapping("/{id}/profile")
    @ResponseStatus(HttpStatus.OK)
    public ProfileResponse patchProfile(@PathVariable String id, @Valid @RequestBody ProfileRequest profileRequest) {
        return userService.patchUserProfile(id, profileRequest);
    }

    @PostMapping("/{userId}/badge")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Assign a badge to a user",
            description = "Allows a user to assign a badge to another user and returns details of the assigned badge.")
    public UserResponse assignBadge(@PathVariable String userId, @RequestParam String giverId, @RequestParam String badgeId) {
        return userService.assignBadge(userId, badgeId, giverId);
    }

    @GetMapping("/{userId}/badge")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve badges assigned to a user",
            description = "Retrieves all badges assigned to a user along with the count of each badge type.")
    public List<BadgeWithCountResponse> getUserBadges(@PathVariable String userId) {
        return userService.getUserBadges(userId);
    }

    @PostMapping("/{userId}/friends/requests")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Send a friend request to a user",
    description = "Allows a user to send a friend request to another user and returns the details of the friend request.")
    public FriendRequestResponse sendFriendRequest(@PathVariable String userId,
                                                   @Valid @RequestBody FriendRequestRequest friendRequestRequest) {
        return userService.sendFriendRequest(userId, friendRequestRequest);
    }

    @PutMapping("/{userId}/friend-requests/{requestId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Accept or decline a friend request",
    description = "Allows a user to accept or decline a friend request and returns a success message if successful.")
    public UpdateFriendRequestResponse updateFriendRequest(@PathVariable String userId, @PathVariable String requestId,
                                                           @Valid @RequestBody UpdateFriendRequestRequest updateFriendRequestRequest) {
        return userService.updateFriendRequest(userId, requestId, updateFriendRequestRequest);
    }

    @GetMapping("/{userId}/friend-requests")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "view received friend requests",
    description = "Retrieves user's friend requests stored in their friend list based on given type.")
    public List<ViewFriendRequestsResponse> getFriendRequests(@PathVariable String userId, @RequestParam List<FriendRequestStatusEnum> type) {
        return userService.getFriendRequests(userId, type);
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.FOUND)
    @Operation(summary = "Search for user",
            description = "Allows the search of users based on name, sport, rank, gender, or date of birth.")
    public Page<ProfileResponse> searchUsers(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) List<String> sports,
            @RequestParam(required = false) List<String> rankings,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String age,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.searchUsers(firstName, lastName, sports, rankings, gender, age, pageable);
    }
}
