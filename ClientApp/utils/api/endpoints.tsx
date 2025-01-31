export const API_ENDPOINTS = {
  REGISTER: "user-service/auth/register",
  REFRESH_TOKEN: "user-service/auth/refresh",
  LOGIN: "user-service/auth/login",
  UPDATE_PROFILE: "user-service/user/{userId}/profile",
  RESET_PASSWORD: "user-service/auth/reset-password",
  GET_USER_BY_ID: "user-service/user/{id}",
  SEARCH_USERS: 'user-service/user/search',
  CREATE_EVENT: "event-service/event",
  GET_EVENT_BY_ID: "event-service/event/{id}",
  GET_ALL_EVENTS: "event-service/event",
  JOIN_EVENT_BY_ID: "event-service/event/{id}/join",
  DELETE_EVENT_BY_ID: "event-service/event/{id}",
  GET_ALL_EVENTS_JOINED: 'event-service/event/patricipant/{userId}', //typo in backend endpoint, shouldn't really need a fix
  GET_ALL_EVENTS_CREATED_BY: 'event-service/event/created-by/{userId}',
    DELETE_PROFILE: 'user-service/user/{userId}',
};
