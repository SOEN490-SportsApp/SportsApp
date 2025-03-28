package app.sportahub.eventservice.dto.request.event;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record WhitelistRequest(        
    @NotNull(message = "User Ids list must be provided")
    List<String> userIds) {

}
