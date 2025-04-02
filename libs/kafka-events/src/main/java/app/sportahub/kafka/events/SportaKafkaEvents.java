package app.sportahub.kafka.events;

/**
 * This class contains the Kafka topics used in the application.
 * It is used to define the topics for different events.
 */
public class SportaKafkaEvents {
    // Forgot Password
    public static final String SEND_REQUEST_TOPIC = "forgot-password.request";
    public static final String SEND_EMAIL_TOPIC = "forgot-password.send-email";

    // Joined Events By User
    public static final String REQUEST_TOPIC = "joined-events-by-user.request";
    public static final String RESPONSE_TOPIC = "joined-events-by-user.response";
    public static final String FETCH_TOPIC = "joined-events-by-user.fetch";
    public static final String FETCHED_TOPIC = "joined-events-by-user.fetched";

    // Notification
    public static final String NOTIFICATION_REQUEST_TOPIC = "notification.send.request";
    public static final String NOTIFICATION_SEND_TOPIC = "notification.send";
}
