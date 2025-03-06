import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "./endpoints";
import { Event } from "@/types/event";

export async function getEventById(eventId: string): Promise<Event> {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.get<Event>(
        API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching event details:", error);
      throw error.response?.data || error;
    }
  }
  
  export async function joinEvent(eventId: string, userId: string): Promise<void> {
    const axiosInstance = getAxiosInstance();
    try {
      await axiosInstance.post(
        API_ENDPOINTS.JOIN_EVENT_BY_ID.replace("{id}", eventId),
        null,
        { params: { userId } }
      );
    } catch (error: any) {
      console.error("Error joining event:", error);
      throw error.response?.data || error;
    }
  }


  export async function getAllEvents(): Promise<Event[]> {
    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.get<Event[]>(API_ENDPOINTS.GET_ALL_EVENTS);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching events:", error);
      throw error.response?.data || error;
    }
  }