/**
 * Axios instance with interceptors for token management and error handling
 * 
 * This module contains: 
 * - Axios configuration options: The configuration options specify the base URL, timeout, and headers for the Axios instance
 * - Helper functions: Manage the access and refresh tokens in AsyncStorage used by the interceptors
 * - Request interceptor: Adds the Authorization header with the access token
 * - Response interceptor to handle 401 Unauthorized errors by refreshing the access token
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { consoleError, ALERT_MESSAGES } from '../utils/api/errorHandlers';
import { API_ENDPOINTS } from '@/utils/api/endpoints';


// Axios configuration options
// *********************************
const config: AxiosRequestConfig = {
  baseURL: 'https://api-dev.sportahub.app/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
};

// Helper functions for token management
// *************************************

// getter functions to get the tokens from AsyncStorage
export const getAccessToken = async (): Promise<string | null> => await AsyncStorage.getItem('accessToken');
export const getRefreshToken = async (): Promise<string | null> => await AsyncStorage.getItem('refreshToken');

// setter functions to store the tokens in AsyncStorage
export const setAccessToken = async (token: string): Promise<void> => await AsyncStorage.setItem('accessToken', token);
export const setRefreshToken = async (token: string) => {await AsyncStorage.setItem('refreshToken', token);}

// setter function that will potentially request a new access token using the refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();

  // if the refreshToken is not found (logged out manually by user) return null
  if (!refreshToken) return null;

  //TODO make this isTokenExpired function to check if the token is expired
  // Decode and check expiration of refresh token
  const payload = JSON.parse(atob(refreshToken.split('.')[1]));
  const now = Math.ceil(Date.now() / 1000);

  // if refresh token is expired return null
  // TODO this should follow up with a ui message to the user to log in again log the user out 
  // only after figuring out how to logout the user without dependencies
  if (payload.exp <= now) return null;

  // request a new access token using the refresh token
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    
    if(newAccessToken && newRefreshToken){
      console.log(`[${new Date().toLocaleTimeString()}] (axiosInstance refreshAccessToken) Recieved new tokens`);
    }    
    
    setAccessToken(newAccessToken); // Update access token in AsyncStorage
    setRefreshToken(newRefreshToken); // Update refresh token in storage      
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      // Network error or no response
      consoleError(ALERT_MESSAGES.networkError.title, ALERT_MESSAGES.networkError.message);
    } else {
      const { status } = error.response;
      
      // Specific handling for common HTTP errors, including status code in the message
      switch (status) {
        case 400:
          consoleError(ALERT_MESSAGES.badRequest.title, ALERT_MESSAGES.badRequest.message, status);
          break;
        case 401:
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // Retry original request
          } else {
            consoleError(ALERT_MESSAGES.sessionExpired.title, ALERT_MESSAGES.sessionExpired.message, status);
            
            // Logout user
            // TODO find a way to remove the user id and the authentication status from the context without dependencies
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('accessToken');
            console.log(`[${new Date().toLocaleTimeString()}] (axiosInstance) Logout successful`);
          }
          break;
        case 403:
          consoleError(ALERT_MESSAGES.forbidden.title, ALERT_MESSAGES.forbidden.message, status);
          break;
        case 404:
          consoleError(ALERT_MESSAGES.notFound.title, ALERT_MESSAGES.notFound.message, status);
          break;
        case 409:
          consoleError(ALERT_MESSAGES.conflict.title, ALERT_MESSAGES.conflict.message, status);
          break;
        case 500:
          consoleError(ALERT_MESSAGES.serverError.title, ALERT_MESSAGES.serverError.message, status);
          break;
        case 503:
          consoleError(ALERT_MESSAGES.serviceUnavailable.title, ALERT_MESSAGES.serviceUnavailable.message, status);
          break;
        case 530:
          consoleError(ALERT_MESSAGES.originDnsError.title, ALERT_MESSAGES.originDnsError.message);
          break;
        default:
          // Fallback for any other status code
          consoleError(ALERT_MESSAGES.defaultError.title, ALERT_MESSAGES.defaultError.message, status);
          break;
      }
    }

    return Promise.reject(error);
  }
);  

export default axiosInstance;
