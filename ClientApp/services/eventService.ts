import axiosInstance from '@/services/axiosInstance';
import { API_ENDPOINTS } from '@/utils/api/endpoints';

export const createEvent = async (eventData: any) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CREATE_EVENT, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};