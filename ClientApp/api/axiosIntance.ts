/**
 * Axios instance with interceptors for token management and error handling
 * 
 * This module contains: 
 * - Axios configuration options: The configuration options specify the base URL, timeout, and headers for the Axios instance
 * - Helper functions: Manage the access and refresh tokens in AsyncStorage used by the interceptors
 * - Request interceptor: Adds the Authorization header with the access token
 * - Response interceptor to handle 401 Unauthorized errors by refreshing the access token
 *  
 * 
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlert, ALERT_MESSAGES } from './alertUtils';


// Axios configuration options
// *********************************
const config: AxiosRequestConfig = {
  //TODO change this to the server URL
  baseURL: 'http://localhost:8000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
};

// Helper functions for token management
// *************************************

// getAccessToken function to retrieve the access token from AsyncStorage
const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('access_token');
};

// setAccessToken function to store the access token in AsyncStorage
const setAccessToken = async (token: string) => {
  await AsyncStorage.setItem('access_token', token);
};

// getRefreshToken function to retrieve the refresh token from AsyncStorage
const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refresh_token');
};

// refreshAccessToken function to get a new access token using the refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  // Get the refresh token from AsyncStorage
  const refreshToken = await getRefreshToken();

  // Check if the refresh token exists
  if (refreshToken) {

    // Decode the refresh token to get the expiration time
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));
    const now = Math.ceil(Date.now() / 1000);

    // Ensure the refresh token has not expired
    if (payload.exp > now) {
      try {
        // Attempt to refresh the access token
        const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;
        await setAccessToken(newAccessToken);
        return newAccessToken;
      } catch (error) {
        // Log the error for debugging purposes
        if (axios.isAxiosError(error)) {
          // Network error (no response from server)
          if (!error.response) {
            console.error('Network error occurred during token refresh:', error.message);
          } 
          // Server error (e.g., 500)
          else if (error.response.status >= 500) {
            console.error('Server error occurred during token refresh:', error.response.status);
          } 
          // Other client-side errors (e.g., 400 Bad Request)
          else {
            console.error('Failed to refresh access token due to client error:', error.response.status, error.response.data);
          }
        } else {
          console.error('Unexpected error occurred during token refresh:', error);
        }
        return null;
      }
    } else {
      console.log('Refresh token has expired');
    }
  } else {
    console.log('No refresh token available');
  }
  return null;
};


// Create Axios instance with the config
// **************************************
const axiosInstance: AxiosInstance = axios.create(config);

// Request Interceptor to add Authorization Token
// **********************************************
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
// ****************************************
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network error or server down
    if (!error.response) {
      showAlert(ALERT_MESSAGES.networkError.title, ALERT_MESSAGES.networkError.message);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized for token refresh failure
    if (error.response.status === 401 && originalRequest.url === `${config.baseURL}token/refresh/`) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized due to expired or invalid token
    if (error.response.status === 401 && error.response.data?.code === 'token_not_valid') {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);  // Retry the original request with new token
      } else {
        showAlert(ALERT_MESSAGES.sessionExpired.title, ALERT_MESSAGES.sessionExpired.message);
      }
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      showAlert(ALERT_MESSAGES.notFound.title, ALERT_MESSAGES.notFound.message);
    }

    // Handle 500+ Server Errors
    else if (error.response.status >= 500) {
      showAlert(ALERT_MESSAGES.serverError.title, ALERT_MESSAGES.serverError.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
