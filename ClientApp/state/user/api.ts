import { UserState } from '@/types';
import { getAxiosInstance } from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
import { mapApiResponseToUserState } from '@/utils/mappers/apiMappers';

/**
 * Fetch user details by ID.
 * @param userId - The ID of the user to fetch
 * @returns A promise resolving to the user's data
 */

export const getUserById = async (userId: string): Promise<UserState> => {
  const axiosInstance = getAxiosInstance();
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_BY_ID.replace('{id}', userId));
    const userData = mapApiResponseToUserState(response.data);
    return userData;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user data.');
  }
};
