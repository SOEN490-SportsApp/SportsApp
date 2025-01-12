package app.sportahub.eventservice.controller;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.service.event.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
@Tag(name = "Event Management", description = "Operations related to event management")
public class EventController {

    private final EventService eventService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve event by ID",
    description = "Fetches an event by their unique identifier.")
    public EventResponse getEventById(@PathVariable String id) {
        return eventService.getEventById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve all events",
    description = "Fetches all events in the database.")
    public List<EventResponse> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new event",
    description = "Creates a new event resource to the database based on the provided event details.")
    public EventResponse createEvent(@Valid @RequestBody EventRequest eventRequest) {
        return eventService.createEvent(eventRequest);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@eventService.isCreator(#id, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
            summary = "Update an existing event",
            description = "Replaces all fields of the specified event. Any field not included in the request body" +
                    " will be reset to default or null."
    )
    public EventResponse updateEvent(@PathVariable String id, @Valid @RequestBody EventRequest eventRequest) {
        return eventService.updateEvent(id, eventRequest);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("@eventService.isCreator(#id, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
            summary = "Partially update an existing event",
            description = "Updates only the specified fields of the given event. Fields not included in the request" +
                    " body remain unchanged."
    )
    public EventResponse patchEvent(@PathVariable String id, @RequestBody EventRequest eventRequest) {
        return eventService.patchEvent(id, eventRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@eventService.isCreator(#id, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Deletes an event", description = "Deletes an event from the database based on the provided event ID.")
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }

    @PostMapping("/{id}/join")
    @PreAuthorize("authentication.name == #userId|| hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Join an event", description = "Enables a user to join an event, provided there are available slots.")
    public ParticipantResponse joinEvent(@PathVariable String id, @RequestParam String userId) {
        return eventService.joinEvent(id, userId);
    }
}
