/**
 * This file contains utility functions used by the axiosInstance file for showing error messages.
 * 
 * This offers the advantage of centralizing error messages and handling using constants.
 * showAlert function wraps the "Alert" component from "react-native".
 * It uses the constants defined in ALERT_MESSAGES to show the alert and allow for easy centralized changes.
 */

import { Alert } from 'react-native';

// Wrapper function for logging errors with specific codes and messages to the console
export const consoleError = (title: string, message: string, code?: number) => {
  const alertTitle = code ? `${title} ${code}` : title;
  const alertMessage = code ? `${message}` : message;
  
  // Log the error details only in development mode
  if (__DEV__) {
    console.error(`ERROR: ${alertTitle} - ${alertMessage}`);
  }
};

// Centralized messages for various HTTP status codes
export const ALERT_MESSAGES = {
  // Common client-side errors
  badRequest: {
    title: 'Bad Request',
    message: 'The server could not understand your request. Please check and try again.',
  },
  unauthorized: {
    title: 'Unauthorized Access',
    message: 'You are not authorized to access this resource. Please log in.',
  },
  forbidden: {
    title: 'Forbidden',
    message: 'You do not have permission to view this resource.',
  },
  notFound: {
    title: 'Resource Not Found',
    message: 'The requested resource was not found on the server.',
  },
  conflict: {
    title: 'Conflict',
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  
  // Server-side errors
  serverError: {
    title: 'Internal Server Error',
    message: 'An error occurred on the server. Please try again later.',
  },
  serviceUnavailable: {
    title: 'Service Unavailable',
    message: 'The server is currently unavailable. Please try again later.',
  },

  // Custom cases for token or session issues
  networkError: {
    title: 'Network Error',
    message: 'Please check your internet connection or server status.',
  },
  sessionExpired: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again to continue.',
  },

  originDnsError: {
    title: 'Service Unreachable',
    message: 'The server is currently unreachable due to DNS issues. Please try again later.',
  },
  
  // Fallback for any other status code
  defaultError: {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again later.',
  },
};
