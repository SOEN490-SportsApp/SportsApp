package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.model.event.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    Optional<Event> findEventById(String id);
    Optional<Event> findEventByEventName(String eventName);
}
