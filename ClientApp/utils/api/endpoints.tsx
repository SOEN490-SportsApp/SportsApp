export const API_ENDPOINTS = {
  REGISTER: "user-service/auth/register",
  REFRESH_TOKEN: "user-service/auth/refresh",
  LOGIN: "user-service/auth/login",
  UPDATE_PROFILE: "user-service/user/{userId}/profile",
  RESET_PASSWORD: "user-service/auth/reset-password",
  GET_USER_BY_ID: "user-service/user/{id}",
  SEARCH_USERS: 'user-service/user/search',
  GET_USER_PROFILE: 'user-service/user/{id}/profile',
  DELETE_PROFILE: 'user-service/user/{userId}',


  CREATE_EVENT: "event-service/event",
  GET_EVENT_BY_ID: "event-service/event/{id}",
  GET_ALL_EVENTS: "event-service/event",
  JOIN_EVENT_BY_ID: "event-service/event/{id}/join",
  DELETE_EVENT_BY_ID: "event-service/event/{id}",
  GET_ALL_EVENTS_JOINED: 'event-service/event/participant/{userId}',
  GET_ALL_EVENTS_CREATED_BY: 'event-service/event/created-by/{userId}',
  GET_EVENTS_BY_USER_ID: "event-service/event/participant/{userId}",
  GET_RELEVANT_EVENTS_FOR_CALENDAR: 'event-service/event/relevant-events',
  SEARCH_EVENTS:"event-service/event/search",
  LEAVE_EVENT: "event-service/event/{id}/leave",
  EDIT_EVENT_BY_ID: 'event-service/event/{id}',
  CANCEL_EVENT_BY_ID: "event-service/event/{id}/cancel",


  SEND_FRIEND_REQUEST: 'user-service/user/{userId}/friends/requests',
  REMOVE_FRIEND_REQUEST: 'user-service/user/{userId}/friends',
  RETRIEVE_USER_FRIEND_REQUESTS: 'user-service/user/{userId}/friend-requests',
  GET_ALL_FRIENDS: 'user-service/user/{userId}/friends',
  RESPOND_TO_FRIEND_REQUEST: 'user-service/user/{userId}/friend-requests/{requestId}',
  GET_PROFILE_BY_ID: 'user-service/user/{userId}/profile',

  GET_PUBLIC_PROFILE:  'user-service/user/{userId}/profile',

  GET_ALL_POSTS: "event-service/event/{eventId}/social/post",
  CREATE_POST: "event-service/event/{eventId}/social/post",

  UPLOAD_FILE: "storage-service/objects/upload",
  GET_FILE: "storage-service/objects/file{objectPath}",

  GET_CHATROOMS: 'messaging-service/messaging/chatrooms/{userId}',
  GET_MESSAGES: 'messaging-service/messaging/chatrooms/messages/{chatroomId}',
  GET_CHATROOM: 'messaging-service/messaging/chatroom/{chatroomId}',
};
