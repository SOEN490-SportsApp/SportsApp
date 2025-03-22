import { FilterState } from "@/components/Helper Components/FilterSection/FilterModal";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { accessibilityProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";

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
export const getEventDetails = async (eventId: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId)
    );
    return response.data;
  } catch (error) {    
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
export const leaveEvent = async (eventId: string, userId: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = `${API_ENDPOINTS.LEAVE_EVENT.replace("{id}", eventId)}?userId=${userId}`;
    const response = await axiosInstance.post(endpoint); 
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error leaving event:", error.response.status, error.response.data);
    } else {
      console.error("Unexpected error:", error.message);
    }
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

export const searchEventsWithFilter = async (
  searchText: string,
  params: FilterState
) => {

  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = API_ENDPOINTS.SEARCH_EVENTS;
    const queryParams: Record<string, string> = {};

    if (searchText) {
      queryParams.eventName = searchText;
    }
    if (params.skillLevel !== "All") {
      queryParams.requiredSkillLevel = params.skillLevel.toUpperCase();
    }

    if(params.minDate !== params.maxDate){
      queryParams.date = addAdjustedDate(params);
    }
    
    if (params.filterType !== "All") {
      queryParams.sportType = params.filterType;
    }

    if (Object.keys(queryParams).length > 0) {
      const response = axiosInstance.get(endpoint, {
        params: queryParams,
      });
      if (response) {
        return (await response).data.content;
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching parametered events:", error);
    throw error;
  }
};

const addAdjustedDate = (params: FilterState) => {
  const minMonth = params.minDate.getMonth() <= 9 ? "0" + params.minDate.getMonth() : params.minDate.getMonth();
  const maxMonth = params.maxDate.getMonth() <= 9 ? "0" + params.maxDate.getMonth() : params.maxDate.getMonth();
  
  const minDate =
    params.minDate.getFullYear() +
    "-" +
    minMonth +
    "-" +
    params.minDate.getDate();
  const maxDate =
    params.maxDate.getFullYear() +
    "-" +
    maxMonth +
    "-" +
    params.maxDate.getDate();

  return minDate + "-" + maxDate;
};

export const editEvent = async (eventId: string, eventData: any) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.patch(
      API_ENDPOINTS.EDIT_EVENT_BY_ID.replace("{id}", eventId),
      eventData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing event:", error);
    throw error;
  }
}

export const getEventById = async (eventId: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}