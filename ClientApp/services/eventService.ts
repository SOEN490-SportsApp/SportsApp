import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
//API_ENDPOINTS.CREATE_EVENT
export const createEvent = async (eventData: any) => {
  try {
    const axiosInstance = getAxiosInstance();
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

// API function that fetches paginated events
export const getEventsJoined = async (
  userId: string,
  page: number = 0,
  size: number = 5
) => {
  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = API_ENDPOINTS.GET_EVENTS_BY_USER_ID.replace(
      "{userId}",
      userId
    );
    const url = `${endpoint}?page=${page}&size=${size}`;
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching joined events:", error);
    throw error;
  }
};

//API_ENDPOINTS.GET_ALL_EVENTS_CREATED_BY
export const getEventsCreated = async (
  userId: string,
  page: number = 0,
  size: number = 5
) => {
  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = API_ENDPOINTS.GET_ALL_EVENTS_CREATED_BY.replace(
      "{userId}",
      userId
    );
    const url = `${endpoint}?page=${page}&size=${size}`;
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching created events:", error);
    throw error;
  }
};

export const searchEvent = async (searchText: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = API_ENDPOINTS.SEARCH_EVENTS;
    const response = await axiosInstance.get(endpoint, {
      params: {
        name: searchText,
      },
    });
    return response.data;
  } catch (err: any) {
    console.log(err);
  }
};
