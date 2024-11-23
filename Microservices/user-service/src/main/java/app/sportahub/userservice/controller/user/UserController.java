package app.sportahub.userservice.controller.user;

import app.sportahub.userservice.dto.request.user.ProfileRequest;
import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.ProfileResponse;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.dto.response.user.badge.BadgeWithCountResponse;
import app.sportahub.userservice.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return userService.getUserById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Do not use this to register a user! Create a new user",
            description = "Creates a new user resource to the database based on the provided user details.")
    public UserResponse createUser(@Valid @RequestBody UserRequest userRequest) {
        return userService.createUser(userRequest);
        return userService.createUser(userRequest);
    }

    @PutMapping("/{id}/profile")
    @ResponseStatus(HttpStatus.OK)
    public ProfileResponse updateProfile(@PathVariable String id, @Valid @RequestBody ProfileRequest profileRequest) {
        return userService.updateUserProfile(id, profileRequest);
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
}
