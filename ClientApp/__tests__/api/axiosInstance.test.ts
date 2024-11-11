/**
 *  This file tests the axiosInstance module for it's error handling capabilities.
 *  It uses the axios-mock-adapter library to mock the Axios instance and test different scenarios.
 */

import axiosInstance from '../../api/axiosInstance';
import MockAdapter from 'axios-mock-adapter'; //used to mock the axios instance
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock"; //mock AsyncStorage for token storage mocking
import { showAlert } from '../../utils/api/errorHandlers'; // Import showAlert function for testing
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
    await AsyncStorage.setItem('access_token', 'testAccessToken');
    mock.onGet('/test-endpoint').reply(200, { data: 'response data' }); // Mock a successful response

    const response = await axiosInstance.get('/test-endpoint'); // Make a request to the mock endpoint
    
    expect(response.data).toEqual({ data: 'response data' }); // Check if the response data is correct
    expect(mock.history.get?.[0]?.headers?.Authorization).toBe('Bearer testAccessToken'); // Check if the Authorization header is set correctly
  });

  it('should handle 401 Unauthorized and refresh token', async () => {
    // Set up an expired access token and a valid refresh token in AsyncStorage
    
    // Store an expired access token in AsyncStorage (expired on November 3rd, 2024)
    await AsyncStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzA2Nzg5Nzd9.n1eJF7SKuP7MtofH8JsytaNMHbBnE6zt1UkbMCxblOU');

    // Store a refresh token with a future expiry date (expires on July 14, 2056)
    await AsyncStorage.setItem('refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MzA3NzkwMDB9.0uH6qCX4VP1becEdC66G89zHX2SswEc94bJuyMVqHUA');

    // Mock the first GET request to return a 401 Unauthorized error
    mock.onGet('/test-endpoint').replyOnce(401, { code: 'token_not_valid' });

    // Mock the token refresh endpoint to return a new access token
    mock.onPost(API_ENDPOINTS.REFRESH_TOKEN).reply(200, {
        access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MzA3NzkwMDB9.0uH6qCX4VP1becEdC66G89zHX2SswEc94bJuyMVqHUA'
    });

    // Mock a successful response for the retried GET request after the token refresh
    mock.onGet('/test-endpoint').reply(200, { data: 'refreshed data' });

    // Make the initial request, which will trigger a 401, then refresh the token, and finally retry with the new token.
    const response = await axiosInstance.get('/test-endpoint');
    
    // Check that the response data is as expected
    expect(response.data).toEqual({ data: 'refreshed data' }); 
    
    // Verify that the new access token has been stored in AsyncStorage
    expect(await AsyncStorage.getItem('access_token')).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MzA3NzkwMDB9.0uH6qCX4VP1becEdC66G89zHX2SswEc94bJuyMVqHUA'
    );

    // Verify that the Authorization header in the retried request contains the new access token
    expect(mock.history.get?.[1]?.headers?.Authorization).toBe('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI3MzA3NzkwMDB9.0uH6qCX4VP1becEdC66G89zHX2SswEc94bJuyMVqHUA');
});


  it('should show alert for network error', async () => {
    // Simulate a network error
    mock.onGet('/test-endpoint').networkError();

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(showAlert).toHaveBeenCalledWith(
      'Network Error',
      'Please check your connection or server status.'
    );
  });

  it('should show alert for 404 Not Found', async () => {
    // Simulate a 404 Not Found error
    mock.onGet('/test-endpoint').reply(404);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(showAlert).toHaveBeenCalledWith(
      'Error',
      'Requested resource not found.'
    );
  });

  it('should show alert for 500 Server Error', async () => {
    // Simulate a 500 Internal Server Error
    mock.onGet('/test-endpoint').reply(500);

    await axiosInstance.get('/test-endpoint').catch(() => {});

    expect(showAlert).toHaveBeenCalledWith(
      'Server Error',
      'Something went wrong. Please try again later.'
    );
  });
});
