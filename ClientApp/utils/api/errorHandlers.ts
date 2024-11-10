/**
 * This file contains utility functions used by the axiosInstance file for showing error messages.
 * 
 * This offers the advantage of centralizing error messages and handling using constants.
 * showAlert function wraps the "Alert" component from "react-native".
 * It uses the constants defined in ALERT_MESSAGES to show the alert and allow for easy centralized changes.
 */

import { Alert } from 'react-native';

//wrapper function for showing alerts
export const showAlert = (title: string, message: string) => {
  if (__DEV__) {
    // allow showing logs in development mode only
    console.log(`ALERT: ${title} - ${message}`);
  }
  Alert.alert(title, message);
};

// Alert messages for different scenarios
export const ALERT_MESSAGES = {
  networkError: {
    title: 'Network Error',
    message: 'Please check your connection or server status.',
  },
  // for 401 unauthorized status code.
  sessionExpired: {
    title: 'Session Expired',
    message: 'Please log in again.',
  },
  // For 500+ server errors, indicating an issue on the server side.
  serverError: {
    title: 'Server Error',
    message: 'Something went wrong. Please try again later.',
  },
  // For 404 Not Found.
  notFound: {
    title: 'Error',
    message: 'Requested resource not found.',
  },
};
