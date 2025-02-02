import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
export const createEvent = async (eventData: any) => {
  try {
    const axiosInstance = getAxiosInstance();
    console.log("eventData", eventData);
    const response = await axiosInstance.post(
      API_ENDPOINTS.CREATE_EVENT,
      eventData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
export const getAllEvents = async () => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_EVENTS);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
export const deleteEvent = async (eventId: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.delete(
      API_ENDPOINTS.DELETE_EVENT_BY_ID.replace("{id}", eventId)
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
