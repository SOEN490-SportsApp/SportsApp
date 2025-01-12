import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { refreshAccessToken, getAuthHeaders } from './tokenService';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { logoutUser } from './authService';
import { ALERT_MESSAGES, consoleError } from '@/utils/api/errorHandlers';

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = () => {
    if (!axiosInstance) {
        throw new Error(
            'Axios instance not configured. Call setupAxiosInstance(dispatch) before using it.'
        );
    }
    return axiosInstance;
};

export const setupAxiosInstance = (dispatch: any): AxiosInstance => {
    if (axiosInstance) {
        return axiosInstance;
    }

    const config: AxiosRequestConfig = {
        baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    axiosInstance = axios.create(config); // Assign to global variable

    axiosInstance.interceptors.request.use(
        async (config) => {
            try {
                const AUTH_ENDPOINTS = [API_ENDPOINTS.LOGIN, API_ENDPOINTS.REFRESH_TOKEN, API_ENDPOINTS.REGISTER, API_ENDPOINTS.RESET_PASSWORD];

                if (
                    AUTH_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint))
                ) {
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

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const status = error.response?.status;
            switch (status) {
                case 400:
                    console.error(ALERT_MESSAGES.badRequest.title, ALERT_MESSAGES.badRequest.message, status);
                    break;
                case 401:
                    const retryCount = (error.config as any)._retryCount || 0;
                    const MAX_RETRY_LIMIT = 1;
                    if (retryCount >= MAX_RETRY_LIMIT) {
                        console.error('Retry limit exceeded.');
                        await logoutUser(dispatch);
                        return Promise.reject(error);
                    }
                    (error.config as any)._retryCount = retryCount + 1;

                    try {
                        await refreshAccessToken();
                        const headers = await getAuthHeaders();
                        const retryConfig = { ...error.config, headers: { ...error.config?.headers, ...headers } };
                        if (!axiosInstance) {
                            throw new Error('Axios instance is not configured.');
                        }
                        return axiosInstance.request(retryConfig);
                        } catch (refreshError) {
                        await logoutUser(dispatch);
                        console.error('Token refresh failed:', refreshError);
                        return Promise.reject(refreshError);
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
                    break;
            }

            if (!error.response) {
                console.error('Network error or no response:', error.message);
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};
