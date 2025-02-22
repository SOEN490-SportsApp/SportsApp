package app.sportahub.eventservice.repository;

import app.sportahub.eventservice.dto.request.LocationRequest;
import app.sportahub.eventservice.enums.SkillLevelEnum;
import app.sportahub.eventservice.model.event.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SearchingEventRepository {
    Page<Event> searchEvent(String eventName,
                            String eventType,
                            String sportType,
                            String locationName,
                            String city,
                            String province,
                            String country,
                            String postalCode,
                            String date,
                            String startTime,
                            String endTime,
                            String duration,
                            String maxParticipants,
                            String createdBy,
                            Boolean isPrivate,
                            List<SkillLevelEnum> requiredSkillLevel,
                            Pageable pageable);
}
