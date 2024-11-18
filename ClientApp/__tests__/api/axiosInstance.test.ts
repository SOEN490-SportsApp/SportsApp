/**
 *  This file tests the axiosInstance module for it's error handling capabilities.
 *  It uses the axios-mock-adapter library to mock the Axios instance and test different scenarios.
 */

import axiosInstance from '../../api/axiosInstance';
import MockAdapter from 'axios-mock-adapter'; //used to mock the axios instance
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock"; //mock AsyncStorage for token storage mocking
import { consoleError } from '../../utils/api/errorHandlers'; // Import showAlert function for testing
import { API_ENDPOINTS } from '@/utils/api/endpoints';

jest.mock('../../utils/api/errorHandlers'); // Mock showAlert for testing alert calls

describe('axiosInstance', () => {
  let mock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(axiosInstance); // Set up mock adapter on axiosInstance
    jest.clearAllMocks(); // Clear mocks before each test
    await AsyncStorage.clear(); // Clear AsyncStorage before each test
  });

  afterEach(() => {
    mock.reset(); // Reset the axios mock after each test
  });

  it('should add Authorization header if access token is available', async () => {
    await AsyncStorage.setItem('accessToken', 'testAccessToken');
    mock.onGet('/test-endpoint').reply(200, { data: 'response data' }); // Mock a successful response

    const response = await axiosInstance.get('/test-endpoint'); // Make a request to the mock endpoint
    
    expect(response.data).toEqual({ data: 'response data' }); // Check if the response data is correct
    expect(mock.history.get[0].headers?.Authorization).toBe('Bearer testAccessToken'); // Check if the Authorization header is set correctly
  });

  it('should handle 401 Unauthorized, refresh the token, and retry the request', async () => {
    // Set up the initial expired access token and valid refresh token in AsyncStorage
    const expiredAccessToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjcwNjc4MDAwLCJleHAiOjE2NzA2NzgwMDB9.INVALID';
    const validRefreshToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjcwNjc4MDAwLCJleHAiOjI3MzA3NzkwMDB9.VALID';

    await AsyncStorage.setItem('accessToken', expiredAccessToken);
    await AsyncStorage.setItem('refreshToken', validRefreshToken);

    // Mock the API call to return a 401 Unauthorized
    mock.onGet('/test-endpoint').replyOnce(401, { message: 'Token expired' });

    // Mock the token refresh endpoint to return a new access token
    const newAccessToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjcwNjc4MDAwLCJleHAiOjM3MzA3NzkwMDB9.NEW';
    
    mock.onPost(API_ENDPOINTS.REFRESH_TOKEN).reply(200, {
      accessToken: newAccessToken,
      refreshToken: validRefreshToken,
    });

    // Mock the retried API call after refreshing the token to return success
    mock.onGet('/test-endpoint').replyOnce(200, { data: 'Refreshed Data' });

    // Make the API call
    const response = await axiosInstance.get('/test-endpoint');

    // Assertions
    expect(response.data).toEqual({ data: 'Refreshed Data' });

    // Check if the new access token was stored
    const storedAccessToken = await AsyncStorage.getItem('accessToken');
    expect(storedAccessToken).toBe(newAccessToken);

    // Verify the Authorization header of the retried request contains the new access token
    expect(mock.history.get[1].headers?.Authorization).toBe(`Bearer ${newAccessToken}`);
  });


  it('should show alert for network error', async () => {
    // Simulate a network error
    mock.onGet('/test-endpoint').networkError();

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Network Error',
      'Please check your internet connection or server status.'
    );
  });

  it('should show alert for 404 Not Found', async () => {
    // Simulate a 404 Not Found error
    mock.onGet('/test-endpoint').reply(404);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Resource Not Found',
      'The requested resource was not found on the server.' , 404
    );
  });

  it('should show alert for 500 Server Error', async () => {
    // Simulate a 500 Internal Server Error
    mock.onGet('/test-endpoint').reply(500);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Internal Server Error',
      'An error occurred on the server. Please try again later.', 500
    );
  });

  it('should show alert for 409 Conflict', async () => {
    // Mock a 409 Internal Server Error
    mock.onGet('/test-endpoint').reply(409);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Conflict',
      'The request could not be completed due to a conflict with the current state of the resource.', 409
    );
  });
  it('should show alert for 503 Server Error', async () => {
    // Mock a 503 Internal Server Error
    mock.onGet('/test-endpoint').reply(503);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Service Unavailable',
      'The server is currently unavailable. Please try again later.', 503
    );
  });
  it('should show alert for 530 Server Error', async () => {
    // Mock a 503 Internal Server Error
    mock.onGet('/test-endpoint').reply(530);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(consoleError).toHaveBeenCalledWith(
      'Service Unreachable',
      'The server is currently unreachable due to DNS issues. Please try again later.'
    );
  });
});
