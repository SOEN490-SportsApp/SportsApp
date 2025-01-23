export const API_ENDPOINTS = {
  REGISTER: "user-service/auth/register",
  REFRESH_TOKEN: "user-service/auth/refresh",
  LOGIN: "user-service/auth/login",
  UPDATE_PROFILE: "user-service/user/{userId}/profile",
  RESET_PASSWORD: "user-service/auth/reset-password",
  GET_USER_BY_ID: "user-service/user/{id}",

  CREATE_EVENT: "event-service/event",
  GET_EVENT_BY_ID: "event-service/event/{id}",
  GET_ALL_EVENTS: "event-service/event",
  JOIN_EVENT_BY_ID: "event-service/event/{id}/join",
};
