import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setupAxiosInstance, getAxiosInstance } from '../../services/axiosInstance';
import { refreshAccessToken, getAuthHeaders } from '../../services/tokenService';
import { logoutUser } from '../../services/authService';
import { ALERT_MESSAGES, consoleError } from '@/utils/api/errorHandlers';

jest.mock('axios');

jest.mock('../../services/tokenService', () => ({
    getAuthHeaders: jest.fn(),
    refreshAccessToken: jest.fn(),
}));

jest.mock('../../services/authService', () => ({
    logoutUser: jest.fn(),
}));

jest.mock('@/utils/api/errorHandlers', () => ({
    ALERT_MESSAGES: {
        badRequest: { title: 'Bad Request', message: 'Invalid request' },
        forbidden: { title: 'Forbidden', message: 'Access denied' },
        notFound: { title: 'Not Found', message: 'Resource not found' },
        conflict: { title: 'Conflict', message: 'Conflict occurred' },
        serverError: { title: 'Server Error', message: 'Internal server error' },
        serviceUnavailable: { title: 'Service Unavailable', message: 'Service temporarily unavailable' },
    },
    consoleError: jest.fn(),
}));

describe('Axios Instance Setup', () => {
    let mockDispatch: jest.Mock;
    let mockAxiosInstance: AxiosInstance;

    beforeEach(() => {
        mockDispatch = jest.fn();
    
        // Mock Axios instance structure with interceptors
        mockAxiosInstance = {
            interceptors: {
                request: { use: jest.fn(), eject: jest.fn() },
                response: { use: jest.fn(), eject: jest.fn() },
            },
            request: jest.fn(),
        } as unknown as jest.Mocked<AxiosInstance>;
    
        // Ensure axios.create returns our mock instance
        (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

        (global as any).axiosInstance = null;
    });
    

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if getAxiosInstance is called before setup', () => {
        expect(() => getAxiosInstance()).toThrow(
            'Axios instance not configured. Call setupAxiosInstance(dispatch) before using it.'
        );
    });

    it('should set up the axios instance with the correct config', () => {
        setupAxiosInstance(mockDispatch);

        expect(axios.create).toHaveBeenCalledWith({
            baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    });

    it('should not recreate an instance if already initialized', () => {
        const instance1 = setupAxiosInstance(mockDispatch);
        const instance2 = setupAxiosInstance(mockDispatch);

        expect(instance1).toBe(instance2);
    });

    it('should attach authorization headers to requests', async () => {
        const mockHeaders = { Authorization: 'Bearer test-token' };
        (getAuthHeaders as jest.Mock).mockResolvedValue(mockHeaders);
    
        const requestInterceptorSpy = jest.spyOn(mockAxiosInstance.interceptors.request, 'use');
    
        setupAxiosInstance(mockDispatch);
        expect(requestInterceptorSpy).toHaveBeenCalledTimes(1);
        const interceptorCallback = requestInterceptorSpy.mock.calls[0]?.[0];
        if (!interceptorCallback) {
            throw new Error('Request interceptor callback is not defined.');
        }
        const mockConfig: InternalAxiosRequestConfig<any> = {
            url: '/secure-endpoint',
            headers: new axios.AxiosHeaders(),
            method: 'get',
            timeout: 5000,
        };
    
        const config = await interceptorCallback(mockConfig);
        expect(config.headers.Authorization).toBe(mockHeaders.Authorization);
        requestInterceptorSpy.mockRestore();
    });

    it('should not attach headers for authentication endpoints', async () => {
        const instance = setupAxiosInstance(mockDispatch);
        expect(instance.interceptors.request.use).toHaveBeenCalled();
        const interceptorCallback = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
        if (interceptorCallback) {
            const config = await interceptorCallback({ url: 'user-service/auth/login', headers: new axios.AxiosHeaders() });
            expect(config.headers?.Authorization).toBeUndefined();
        } else {
            fail('Request interceptor callback is not defined.');
        }
    });

    it('should handle 401 error by refreshing the token and retrying the request', async () => {
        (refreshAccessToken as jest.Mock).mockResolvedValue(null);
        (getAuthHeaders as jest.Mock).mockResolvedValue({ Authorization: 'Bearer new-token' });
    
        const instance = setupAxiosInstance(mockDispatch);
    
        expect(instance.interceptors.response.use).toHaveBeenCalled();
    
        const interceptorCallback = (instance.interceptors.response.use as jest.Mock).mock.calls[0]?.[1];
    
        if (!interceptorCallback) {
            throw new Error('Response interceptor callback is not defined.');
        }
    
        const error: AxiosError = {
            message: 'Simulated 401 error',
            response: { status: 401 },
            config: {
                url: '/secure-endpoint',
                headers: { Authorization: undefined },
            },
        } as AxiosError;
    
        await interceptorCallback(error);
    
        expect(refreshAccessToken).toHaveBeenCalled();
    
        expect(instance.request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: '/secure-endpoint',
                headers: expect.objectContaining({
                    Authorization: 'Bearer new-token',
                }),
            })
        );
    });
    
    
    

    it('should log error and logout user if token refresh fails', async () => {
        // Mock the token refresh failure
        (refreshAccessToken as jest.Mock).mockRejectedValue(new Error('Refresh failed'));
    
        // Setup Axios instance
        const instance = setupAxiosInstance(mockDispatch);
    
        // Ensure response interceptor was added
        expect(instance.interceptors.response.use).toHaveBeenCalled();
    
        // Get the interceptor callback (error handler)
        const interceptorCallback = (instance.interceptors.response.use as jest.Mock).mock.calls[0]?.[1];
    
        if (!interceptorCallback) {
            throw new Error('Response interceptor callback is not defined.');
        }
    
        // Create a well-structured Axios error
        const error: AxiosError = {
            message: 'Simulated 401 error',
            name: 'AxiosError',
            isAxiosError: true,
            toJSON: () => ({}),
            response: {
                status: 401,
                statusText: 'Unauthorized',
                data: null,
                headers: {},
                config: {} as InternalAxiosRequestConfig<any>,
            },
            config: {
                url: '/secure-endpoint',
                headers: new axios.AxiosHeaders({ Authorization: 'Bearer old-token' }),
                method: 'get',
                timeout: 5000,
            } as InternalAxiosRequestConfig<any>,
        } as AxiosError;
    
        try {
            await interceptorCallback(error);
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toBe('Refresh failed');
            } else {
                throw err;
            }
        }
    
        // Ensure logoutUser is called correctly
        expect(logoutUser).toHaveBeenCalledWith(mockDispatch);
    });
    
    

    it('should log error and logout user if token refresh fails', async () => {
        // Mock refresh token failure
        (refreshAccessToken as jest.Mock).mockRejectedValue(new Error('Refresh failed'));
    
        // Setup Axios instance
        const instance = setupAxiosInstance(mockDispatch);
    
        // Ensure response interceptor was attached
        expect(instance.interceptors.response.use).toHaveBeenCalled();
    
        // Get the error handler (second parameter of the interceptor)
        const interceptorCallback = (instance.interceptors.response.use as jest.Mock).mock.calls[0]?.[1];
    
        if (!interceptorCallback) {
            throw new Error('Response interceptor callback is not defined.');
        }
    
        // Create mock error response
        const error: AxiosError = {
            message: 'Simulated 401 error',
            name: 'AxiosError',
            isAxiosError: true,
            response: {
                status: 401,
                statusText: 'Unauthorized',
                data: null,
                headers: {},
                config: {} as InternalAxiosRequestConfig<any>,
            },
            config: {
                url: '/secure-endpoint',
                headers: { Authorization: undefined },
            } as InternalAxiosRequestConfig<any>,
        } as AxiosError;
    
        // Use expect.rejects to handle promise rejection properly
        await expect(interceptorCallback(error)).rejects.toThrow('Refresh failed');
    
        // Ensure logoutUser is called
        expect(logoutUser).toHaveBeenCalledWith(mockDispatch);
    });

    //TODO bring back with a fix
    // it('should log network errors correctly', async () => {
    //     // Mock console.error to track calls
    //     jest.spyOn(console, 'error').mockImplementation(() => {});
    
    //     // Setup Axios instance
    //     const instance = setupAxiosInstance(mockDispatch);
    
    //     // Ensure the response interceptor was attached
    //     expect(instance.interceptors.response.use).toHaveBeenCalled();
    
    //     // Extract the interceptor callback (error handler)
    //     const interceptorCallback = (instance.interceptors.response.use as jest.Mock).mock.calls[0]?.[1];
    
    //     if (!interceptorCallback) {
    //         throw new Error('Response interceptor callback is not defined.');
    //     }
    
    //     // Mock a network error with no response object
    //     const error: AxiosError = { message: 'Network Error' } as AxiosError;
    
    //     // Expect the interceptor to reject with the same error object
    //     await expect(interceptorCallback(error)).rejects.toBe(error);
    
    //     // Ensure the correct console.error message was logged
    //     expect(console.error).toHaveBeenCalledWith('Network error or no response:', 'Network Error');
    
    //     // Restore console.error to avoid side effects
    //     (console.error as jest.Mock).mockRestore();
    // });
    
    it('should preserve existing non-authorization headers', async () => {
        (getAuthHeaders as jest.Mock).mockResolvedValue({ Authorization: 'Bearer new-token' });
    
        const instance = setupAxiosInstance(mockDispatch);
    
        const interceptorCallback = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    
        const mockConfig: InternalAxiosRequestConfig<any> = {
            url: '/secure-endpoint',
            headers: { 'Content-Type': 'application/json' } as any,
            method: 'get',
            timeout: 5000,
        };
    
        const config = await interceptorCallback(mockConfig);
    
        expect(config.headers.Authorization).toBe('Bearer new-token');
        expect(config.headers['Content-Type']).toBe('application/json');
    });
    
    it('should handle missing request URL gracefully', async () => {
        (getAuthHeaders as jest.Mock).mockResolvedValue({ Authorization: 'Bearer new-token' });
    
        const instance = setupAxiosInstance(mockDispatch);
        const interceptorCallback = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    
        // Simulate a request with missing URL
        const mockConfig: InternalAxiosRequestConfig<any> = {
            headers: new axios.AxiosHeaders(),
            method: 'get',
            timeout: 5000,
        };
    
        // Expect it to resolve with added headers, not throw
        const result = await interceptorCallback(mockConfig);
    
        expect(result.headers.Authorization).toBe('Bearer new-token');
        expect(result).toHaveProperty('method', 'get');
        expect(result).toHaveProperty('timeout', 5000);
    });
    
    
    // it('should handle 400 Bad Request errors correctly', async () => {
    //     const instance = setupAxiosInstance(mockDispatch);
    //     const interceptorCallback = (instance.interceptors.response.use as jest.Mock).mock.calls[0][1];
    
    //     if (!interceptorCallback) {
    //         throw new Error('Response interceptor callback is not defined.');
    //     }
    
    //     const error: AxiosError = {
    //         message: 'Bad Request Error',
    //         response: { status: 400 },
    //         config: { url: '/secure-endpoint', headers: new axios.AxiosHeaders() },
    //     } as AxiosError;
    
    //     await interceptorCallback(error).catch((err: any) => {
    //         expect(err).toBe(error);
    //     });
    
    //     expect(consoleError).toHaveBeenCalledWith(
    //         ALERT_MESSAGES.badRequest.title,
    //         ALERT_MESSAGES.badRequest.message,
    //         400
    //     );
    // });
    
});
