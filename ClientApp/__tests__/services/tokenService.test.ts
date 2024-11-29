import { deleteFromSecureStore, getFromSecureStore } from '@/services/secureStore';
import { clearTokens, getAuthHeaders, saveTokens } from '@/services/tokenService';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  }));

describe('Token Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
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
});  