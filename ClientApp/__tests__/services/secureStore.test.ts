import { deleteFromSecureStore, getFromSecureStore, saveToSecureStore } from '@/services/secureStore';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('Secure Storage Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a value to secure store', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await saveToSecureStore(key, value);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(key, value);
  });

  it('should retrieve a value from secure store', async () => {
    const key = 'testKey';
    const value = 'testValue';

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(value);

    const result = await getFromSecureStore(key);

    expect(result).toBe(value);
  });

  it('should return null for non-existent key', async () => {
    const key = 'nonExistentKey';

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const result = await getFromSecureStore(key);

    expect(result).toBeNull();
  });

  it('should delete a value from secure store', async () => {
    const key = 'testKey';

    await deleteFromSecureStore(key);

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
  });
});