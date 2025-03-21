package app.sportahub.eventservice.repository.event;

import app.sportahub.eventservice.model.event.Event;
import app.sportahub.eventservice.repository.SearchingEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String>, SearchingEventRepository {

    Optional<Event> findEventById(String id);

    Page<Event> findByLocationCoordinatesNear(GeoJsonPoint point, Distance distance, Pageable pageable);

    Optional<Event> findEventByEventName(String eventName);

    Page<Event> findByParticipantsUserId(String userId, Pageable pageable);

    Page<Event> findByCreatedBy(String userId, Pageable pageable);

    @Query("{ 'participants.userId' : ?0 }")
    List<Event> findAllByParticipantUserId(String userId);
}
