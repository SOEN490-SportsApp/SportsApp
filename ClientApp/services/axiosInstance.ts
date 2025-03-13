import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { refreshAccessToken, getAuthHeaders } from './tokenService';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { logoutUser } from './authService';
import { ALERT_MESSAGES, consoleError } from '@/utils/api/errorHandlers';

interface ErrorResponseData {
    error?: string;
    [key: string]: any; // To account for additional properties in the response
}

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = (): AxiosInstance => {
    if (!axiosInstance) {
        throw new Error('Axios instance not configured. Call setupAxiosInstance(dispatch) before using it.');
    }
    return axiosInstance;
};

export const setupAxiosInstance = (dispatch: any): AxiosInstance => {
    if ((global as any).axiosInstance) {
        return (global as any).axiosInstance;
    }

    const config: AxiosRequestConfig = {
        baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // Fallback for baseURL
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };
    

    axiosInstance = axios.create(config); // Assign to global variable

    // Request interceptor
    axiosInstance.interceptors.request.use(
        async (config) => {
            try {
                const AUTH_ENDPOINTS = [
                    API_ENDPOINTS.LOGIN,
                    API_ENDPOINTS.REFRESH_TOKEN,
                    API_ENDPOINTS.REGISTER,
                    API_ENDPOINTS.RESET_PASSWORD,
                ];

                // Skip adding Authorization header for auth-related endpoints
                if (AUTH_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint))) {
                    return config;
                }

                const headers = await getAuthHeaders();
                config.headers.Authorization = headers.Authorization;
                return config;
            } catch (error) {
                console.error('Error attaching headers:', error);
                throw error;
            }
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response, // Pass through successful responses
        async (error: AxiosError<ErrorResponseData>) => {
            const status = error.response?.status;
            const errorData = error.response?.data;

            switch (status) {
                case 400:
                    consoleError(ALERT_MESSAGES.badRequest.title, ALERT_MESSAGES.badRequest.message, status);
                    break;

                case 401: {
                    const retryCount = (error.config as any)?._retryCount || 0;
                    const MAX_RETRY_LIMIT = 1;

                    // Handle invalid credentials
                    if (errorData?.error && errorData.error.includes('invalid_grant')) {
                        consoleError(
                            ALERT_MESSAGES.invalidCredentials.title,
                            ALERT_MESSAGES.invalidCredentials.message,
                            status
                        );
                        return Promise.reject(new Error(ALERT_MESSAGES.invalidCredentials.message));
                    }

                    // Retry logic for token expiration
                    if (retryCount >= MAX_RETRY_LIMIT) {
                        console.error('Retry limit exceeded.');
                        await logoutUser(dispatch);
                        return Promise.reject(error);
                    }

                    (error.config as any)._retryCount = retryCount + 1;

                    try {
                        await refreshAccessToken();
                        const headers = await getAuthHeaders();
                        if (!axiosInstance) {
                            throw new Error('Axios instance is not configured.');
                        }
                        const retryConfig = {
                            ...error.config,
                            headers: { ...error.config?.headers, ...headers },
                        };
                        return axiosInstance.request(retryConfig);
                    } catch (refreshError) {
                        await logoutUser(dispatch);
                        console.error('Token refresh failed:', refreshError);
                        return Promise.reject(refreshError);
                    }
                }

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

                default:
                    consoleError(ALERT_MESSAGES.defaultError.title, ALERT_MESSAGES.defaultError.message);
                    break;
            }

            // Handle network errors or cases without a response
            if (!error.response) {
                console.error('Network error or no response:', error.message);
                return Promise.reject(new Error(ALERT_MESSAGES.networkError.message));
            }

            return Promise.reject(error);
        }
    );
    (global as any).axiosInstance = axiosInstance;
    return axiosInstance;
};

    