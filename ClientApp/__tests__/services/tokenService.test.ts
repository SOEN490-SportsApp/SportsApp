import { deleteFromSecureStore, getFromSecureStore } from '@/services/secureStore';
import {
  clearTokens,
  getAuthHeaders,
  saveTokens,
  refreshAccessToken,
  startTokenRefresh,
  stopTokenRefresh
} from '@/services/tokenService';
import * as SecureStore from 'expo-secure-store';
import { getAxiosInstance } from '@/services/axiosInstance';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@/services/axiosInstance', () => ({
  getAxiosInstance: jest.fn(),
}));

jest.mock('@/services/tokenService', () => ({
  ...jest.requireActual('@/services/tokenService'),
  getAccessToken: jest.fn(),
}));

const mockAxios = {
  post: jest.fn(),
};
(getAxiosInstance as jest.Mock).mockReturnValue(mockAxios);

describe('Token Service Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const ACCESS_TOKEN_PART1_KEY = 'accessTokenPart1';
  const ACCESS_TOKEN_PART2_KEY = 'accessTokenPart2';
  const REFRESH_TOKEN_KEY = 'refreshToken';
  const TOKEN_EXPIRY_KEY = 'tokenExpiry';

  it('should clear all access tokens and expiry from secure storage', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(true);
    await clearTokens();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(4);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PART1_KEY);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PART2_KEY);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_EXPIRY_KEY);
  });

  it('should throw error if access token part is missing', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await expect(getAuthHeaders()).rejects.toThrow('Access token not found');
  });

  it('should delete a value from secure store', async () => {
    const key = 'testKey';

    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(true);
    await deleteFromSecureStore(key);

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
  });

  it('should save tokens to secure store', async () => {
    const accessToken = 'access.token.mocked';
    const refreshToken = 'refresh.token.mocked';
    const decoded = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour expiry
    jest.spyOn(JSON, 'parse').mockReturnValue(decoded);

    await saveTokens(accessToken, refreshToken);

    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(4);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PART1_KEY, 'access.tok');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PART2_KEY, 'en.mocked');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY, refreshToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(TOKEN_EXPIRY_KEY, `${decoded.exp * 1000}`);
  });

  it('should start token refresh timer and refresh on expiry', async () => {
    jest.useFakeTimers();
    const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes from now
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(`${expiryTime}`);
    jest.spyOn(global, 'setTimeout');

    await startTokenRefresh();

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60 * 1000); // Refresh 1 minute before expiry
  });

  it('should stop token refresh timer', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    stopTokenRefresh();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should throw error if refresh token is missing during refresh', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await expect(refreshAccessToken()).rejects.toThrow('Refresh token not found');
  });

  it('should handle errors during token refresh gracefully', async () => {
    const refreshToken = 'refresh.token.mocked';

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(refreshToken);
    mockAxios.post.mockRejectedValueOnce(new Error('Refresh failed'));

    await expect(refreshAccessToken()).rejects.toThrow('Refresh failed');

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(4); // Tokens should be cleared on failure
  });

  it('should handle token refresh scheduling and retry on failure', async () => {
    const startTokenRefreshSpy = jest.spyOn(global, 'setTimeout');
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce((Date.now() + 2 * 60 * 1000).toString());
    jest.spyOn(console, 'error').mockImplementation(() => { });

    await startTokenRefresh();

    expect(startTokenRefreshSpy).toHaveBeenCalled();
    jest.runAllTimers(); // Simulate the timer execution
  });

  it('should stop token refresh', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    stopTokenRefresh();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should return null if access token parts are missing', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    const accessToken = await getFromSecureStore(ACCESS_TOKEN_PART1_KEY);

    expect(accessToken).toBeNull();
  });

  it('should log an error if access token retrieval fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to retrieve token');
    });

    await expect(getAuthHeaders()).rejects.toThrow('Access token not found');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error retrieving access token'), expect.any(Error));
  });

  it('should log an error and throw if decodeJWT fails', async () => {
    const invalidAccessToken = 'invalid.token.here';
    const refreshToken = 'validRefreshToken';

    await expect(saveTokens(invalidAccessToken, refreshToken)).rejects.toThrow('Error decoding JWT');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to decode JWT:'),
      expect.any(Error)
    );
  });

  it('should log an error and throw if the token has no "exp"', async () => {
    const jwtWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.abc';
    const refreshToken = 'validRefreshToken';

    await expect(saveTokens(jwtWithoutExp, refreshToken)).rejects.toThrow('Error decoding JWT');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to decode JWT:'),
      expect.any(Error)
    );
  });
});  