package app.sportahub.eventservice.controller.event;

import app.sportahub.eventservice.dto.request.event.EventRequest;
import app.sportahub.eventservice.dto.request.event.WhitelistRequest;
import app.sportahub.eventservice.dto.request.event.EventCancellationRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.dto.response.ParticipantResponse;
import app.sportahub.eventservice.enums.EventSortingField;
import app.sportahub.eventservice.enums.SortDirection;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.dto.response.ReactionResponse;
import app.sportahub.eventservice.model.event.reactor.ReactionType;
import app.sportahub.eventservice.service.event.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


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

    @GetMapping("/relevant-events")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve events by location",
            description = "Fetches events based on the provided location.")
    public ResponseEntity<?> getEventsByLocation(
            @RequestParam double longitude,
            @RequestParam double latitude,
            @RequestParam(defaultValue = "25.0") double radius,
            @RequestParam(defaultValue= "false") boolean radiusExpansion,
            @RequestParam(defaultValue = "true") boolean paginate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return eventService.getRelevantEvents(longitude, latitude, radius, radiusExpansion, paginate, page, size);
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
    @PreAuthorize("authentication.name == #userId || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Join an event", description = "Enables a user to join an event, provided there are available slots.")
    public ParticipantResponse joinEvent(@PathVariable String id, @RequestParam String userId) {
        return eventService.joinEvent(id, userId);
    }

    @PostMapping("/{id}/leave")
    @PreAuthorize("authentication.name == #userId || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Leave an event", description = "Enables a user to leave an event, provided they already joined.")
    public ParticipantResponse leaveEvent(@PathVariable String id, @RequestParam String userId) {
        return eventService.leaveEvent(id, userId);
    }

    @GetMapping("/participant/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve events by user ID", description = "Retrieve events that a user has participated in")
    public Page<EventResponse> getEventByUserId(@PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "DESC") SortDirection sort,
            @RequestParam(defaultValue = "DATE") EventSortingField field) {
        return eventService.getEventsByParticipantId(userId, page, size, sort, field);
    }

    @GetMapping("created-by/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Retrieve events created by user ID", description = "Retrieve events that a user has created")
    public Page<EventResponse> getEventsCreatedByUserId(@PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "DESC") SortDirection sort,
            @RequestParam(defaultValue = "DATE") EventSortingField field) {
        return eventService.getEventsCreatedByUserId(userId, page, size, sort, field);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("@eventService.isCreator(#id, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Cancel an event", description = "Marks an event as 'Cancelled' instead of deleting it.")
    public EventResponse cancelEvent(@PathVariable String id,
            @RequestBody @Valid EventCancellationRequest cancelRequest) {
        return eventService.cancelEvent(id, cancelRequest);
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Search for events",
            description = "Allows the search of events based on various filters like name, sport type, event type, location, date, and more.")
    public Page<EventResponse> searchEvents(
            @RequestParam(required = true) double longitude,
            @RequestParam(required = true) double latitude,
            @RequestParam(required = false) String eventName,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String sportType,
            @RequestParam(required = false) String locationName,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String postalCode,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String maxParticipants,
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) Boolean isPrivate,
            @RequestParam(required = false) List<SkillLevelEnum> requiredSkillLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventService.searchEvents(eventName, eventType, sportType, locationName, city, province, country,
                postalCode, date, startTime, endTime, duration, maxParticipants, createdBy, isPrivate,
                requiredSkillLevel, pageable, longitude, latitude);
    }

    @PostMapping("/{id}/reaction")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "React to an event", description = "Enables a user to react to an event.")
    public ReactionResponse reactToEvent(@PathVariable String id,
            @RequestParam ReactionType reaction) {
        return eventService.reactToEvent(id, reaction);
    }

    @PatchMapping("/{id}/whitelist")
    @PreAuthorize("@eventService.isCreator(#id, authentication.name) || hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Whitelist users", description = "Add users to the whitelist of an event.")
    public EventResponse whitelistUsers(@PathVariable String id,
            @RequestBody WhitelistRequest whitelistRequest) {
        return eventService.whitelistUsers(id, whitelistRequest);
    }
}
