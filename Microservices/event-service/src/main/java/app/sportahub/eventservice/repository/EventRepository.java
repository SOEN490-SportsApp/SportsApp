package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.model.event.Event;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    Optional<Event> findEventById(String id);
    Optional<Event> findEventByEventName(String eventName);
    Page<Event> findByParticipantsUserId(String userId, Pageable pageable);
    Page<Event> findByCreatedBy(String userId, Pageable pageable);
}
