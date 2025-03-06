import { getAxiosInstance } from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
// API_ENDPOINTS.GET_CHATROOMS

export const getChatrooms = async (userId: string) => {
  try {
    const axiosInstance = await getAxiosInstance();
    const response = await axiosInstance.get(
        API_ENDPOINTS.GET_CHATROOMS.replace("{userId}", userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    throw error;
  }
};
