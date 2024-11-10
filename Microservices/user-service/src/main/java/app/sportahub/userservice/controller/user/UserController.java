package app.sportahub.userservice.controller.user;

import app.sportahub.userservice.dto.request.user.UserRequest;
import app.sportahub.userservice.dto.response.user.UserResponse;
import app.sportahub.userservice.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
        return UserResponse.from(userService.getUserById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Do not use this to register a user! Create a new user",
            description = "Creates a new user resource to the database based on the provided user details.")
    public UserResponse createUser(@Valid @RequestBody UserRequest userRequest) {
        return UserResponse.from(userService.createUser(userRequest));
    }
}
