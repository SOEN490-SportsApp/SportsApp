package app.sportahub.eventservice.controller;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.service.event.EventService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

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
        return EventResponse.from(eventService.getEventById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Creates a new event",
    description = "Creates a new event resource to the database based on the provided event details.")
    public EventResponse createEvent(@Valid @RequestBody EventRequest eventRequest) {
        return EventResponse.from(eventService.createEvent(eventRequest));
    }
}
