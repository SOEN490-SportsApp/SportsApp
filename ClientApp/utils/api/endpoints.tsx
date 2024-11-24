export const API_ENDPOINTS = {
    REGISTER: 'user-service/auth/register',
    REFRESH_TOKEN: 'user-service/auth/refresh',
    LOGIN: 'user-service/auth/login',
    UPDATE_PROFILE: 'user-service/user/{userId}/profile'
    // add more after authentication
  };
  
  export const UPDATE_PROFILE_ENDPOINT = (userId: string) => {
    return API_ENDPOINTS.UPDATE_PROFILE.replace('{userId}', userId);
  };