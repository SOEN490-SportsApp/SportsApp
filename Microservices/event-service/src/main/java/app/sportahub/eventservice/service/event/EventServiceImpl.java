package app.sportahub.eventservice.service.event;

import app.sportahub.eventservice.dto.request.EventRequest;
import app.sportahub.eventservice.dto.request.ParticipantRequest;
import app.sportahub.eventservice.dto.request.TeamRequest;
import app.sportahub.eventservice.dto.response.EventResponse;
import app.sportahub.eventservice.exception.event.EventAlreadyExistsException;
import app.sportahub.eventservice.exception.event.EventDoesNotExistException;
import app.sportahub.eventservice.mapper.event.EventMapper;
import app.sportahub.eventservice.model.event.Event;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public EventResponse getEventById(String id) {
        return eventMapper.eventToEventResponse(eventRepository.findEventById(id)
                .orElseThrow(() -> new EventDoesNotExistException(id)));
    }

    @Override
    public EventResponse createEvent(EventRequest eventRequest) {
        eventRepository.findEventByEventName(eventRequest.eventName())
                .ifPresent(event -> {
                    throw new EventAlreadyExistsException(eventRequest.eventName());
                });
        /*
        List<Participant> participants = new ArrayList<>();

        if (eventRequest.participants() != null) {

            for (ParticipantRequest participantRequest : eventRequest.participants()) {
                participants.add(Participant.builder().withUserId(participantRequest.userId())
                        .withAttendStatus(participantRequest.attendStatus())
                        .withJoinedOn(participantRequest.joinedOn()).build());
            }
        }

        List<Team> teams = new ArrayList<>();

        if (eventRequest.teams() != null) {
            for (TeamRequest teamRequest : eventRequest.teams()) {
                teams.add(Team.builder().withTeamId(teamRequest.teamId()).build());
            }
        }
         */

        Event event = eventMapper.eventRequestToEvent(eventRequest)
                .toBuilder()
                .withCreationDate(Timestamp.valueOf(LocalDateTime.now()))
                .withUpdatedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        Event savedEvent = eventRepository.save(event);
        log.info("EventServiceImpl::createEvent: Event with id: {} was successfully created", savedEvent.getId());
        return eventMapper.eventToEventResponse(savedEvent);
    }
}
