package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.request.ParticipantRequest;
import app.sportahub.eventservice.dto.request.TeamRequest;
import app.sportahub.eventservice.exception.event.EventAlreadyExistsException;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.model.event.Location;
import app.sportahub.eventservice.model.event.Participant;
import app.sportahub.eventservice.model.event.Team;
import app.sportahub.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id).orElseThrow(() -> new EventDoesNotExistException(id));
    }

    @Override
    public Event createEvent(EventRequest eventRequest) {
        Optional<Event> optionalEventById = eventRepository.findEventById(eventRequest.id());

        if (optionalEventById.isPresent()) {
            throw new EventAlreadyExistsException(eventRequest.id());
        }

        List<Participant> participants = new ArrayList<>();

        for (ParticipantRequest participantRequest : eventRequest.participants()) {
            participants.add(Participant.builder().withUserId(participantRequest.userId())
                    .withAttendStatus(participantRequest.attendStatus())
                    .withJoinedOn(participantRequest.joinedOn()).build());
        }

        List<Team> teams = new ArrayList<>();

        for (TeamRequest teamRequest : eventRequest.teams()) {
            teams.add(Team.builder().withTeamId(teamRequest.teamId()).build());
        }

        Event event = Event.builder().withId(eventRequest.id())
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .withEventName(eventRequest.eventName())
                .withEventType(eventRequest.eventType())
                .withSportType(eventRequest.sportType())
                .withLocation(eventRequest.location() != null ? Location.builder()
                        .withName(eventRequest.location().name())
                        .withStreetNumber(eventRequest.location().streetNumber())
                        .withStreetName(eventRequest.location().streetName())
                        .withCity(eventRequest.location().city())
                        .withProvince(eventRequest.location().province())
                        .withCountry(eventRequest.location().country())
                        .withPostalCode(eventRequest.location().postalCode())
                        .withAddressLine2(eventRequest.location().adressLine2())
                        .withPhoneNumber(eventRequest.location().phoneNumber())
                        .withLatitude(eventRequest.location().latitude())
                        .withLongitude(eventRequest.location().longitude())
                                .build()
                        : null)
                .withDate(eventRequest.date())
                .withDuration(eventRequest.duration())
                .withParticipants(participants)
                .withCreatedBy(eventRequest.createdBy())
                .withTeams(teams)
                .withCutOffTime(eventRequest.cutOffTime())
                .withDescription(eventRequest.description())
                .withWhitelistedUsers(eventRequest.whitelistedUsers())
                .build();

        Event savedEvent = eventRepository.save(event);
        log.info("EventServiceImpl::createEvent: Event with id: {} was successfully created", savedEvent.getId());
        return savedEvent;
    }
}
