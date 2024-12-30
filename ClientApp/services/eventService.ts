import axiosInstance from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';
//API_ENDPOINTS.CREATE_EVENT
export const createEvent = async (eventData: any) => {
  try {
    const response = await axiosInstance.post("https://api-dev.sportahub.app/api/event-service/event", eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};