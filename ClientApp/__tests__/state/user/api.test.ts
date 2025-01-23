import { getUserById } from '@/state/user/api';
import { getAxiosInstance } from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { mapApiResponseToUserState } from '@/utils/mappers/apiMappers';

jest.mock('@/services/axiosInstance', () => ({
  getAxiosInstance: jest.fn(),
}));

jest.mock('@/utils/mappers/apiMappers', () => ({
  mapApiResponseToUserState: jest.fn(),
}));

describe('getUserById', () => {
  it('should return user data when the API call is successful', async () => {
    const mockUserId = '123';
    const mockApiResponse = { name: 'John Doe', email: 'john.doe@example.com' };
    const mockMappedUserData = { name: 'John Doe', email: 'john.doe@example.com', role: 'User' };

    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: mockApiResponse }),
    };
    (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

    (mapApiResponseToUserState as jest.Mock).mockReturnValue(mockMappedUserData);

    const result = await getUserById(mockUserId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', mockUserId));
    expect(mapApiResponseToUserState).toHaveBeenCalledWith(mockApiResponse);
    expect(result).toEqual(mockMappedUserData);
  });

  it('should throw an error when the API call fails', async () => {
    const mockUserId = '123';
    const mockError = new Error('API error');

    const mockAxiosInstance = {
      get: jest.fn().mockRejectedValue(mockError),
    };
    (getAxiosInstance as jest.Mock).mockReturnValue(mockAxiosInstance);

    await expect(getUserById(mockUserId)).rejects.toThrow('Failed to fetch user data.');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', mockUserId));
  });
});
