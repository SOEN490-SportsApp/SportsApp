package app.sportahub.eventservice.enums;

public enum EventSortingField {
    EVENT_NAME("eventName"),
    SPORT_TYPE("sportType"),
    DATE("date"),
    START_TIME("startTime"),
    END_TIME("endTime"),
    DURATION("duration"),
    MAX_PARTICIPANTS("maxParticipants"),
    CREATED_BY("createdBy");

    private final String field;

    EventSortingField(String field) {
        this.field = field;
    }

    public String getFieldName() {
        return this.field;
    }
}
