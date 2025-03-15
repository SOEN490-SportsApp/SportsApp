package app.sportahub.kafkevents.forgotPassword;

public final class ForgotPasswordEvent {
    public static final String SEND_REQUEST_TOPIC = "forgot-password.request";
    public static final String SEND_EMAIL_TOPIC = "forgot-password.send-email";
}
