import { FilterState } from "@/components/Helper Components/FilterSection/FilterModal";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { accessibilityProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { useSelector } from "react-redux";
import { calculateDistanceBetweenEventAndUserLocation } from "./locationService";
import { Event } from "@/types/event";
import { LocationState } from "@/state/location/locationSlice";
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

export const getAllRelevantEvents = async (
  location: LocationState,
  radius = 15, 
  radiusExpansion: boolean, 
  paginate: boolean, 
  page = 0 , 
  size = 10
) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(API_ENDPOINTS.GET_RELEVANT_EVENTS_FOR_CALENDAR, {
      params: {
        longitude: location.longitude,
        latitude: location.latitude,
        radius: radius,
        radiusExpansion: radiusExpansion,
        paginate: paginate,
        page: page,
        size: size
      }
    });
    // Ensure response.data.content exists and is an array
    if (Array.isArray(response.data?.content)) {
      const updatedContent = response.data.content.map((event: Event) => ({
        ...event,
        far: calculateDistanceBetweenEventAndUserLocation(event, location),
      }));

      return {
        data: {
          ...response.data,
          content: updatedContent,
        },
      };    
    }
    return {
       data: response.data 
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        data: {
          content: [],
        },
      };
    }
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
  location: LocationState,
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

    // Ensure response.data.content exists and is an array
    if (Array.isArray(response.data?.content)) {
      const updatedContent = response.data.content.map((event: Event) => ({
        ...event,
        far: calculateDistanceBetweenEventAndUserLocation(event, location),
      }));

      return {
        data: {
          ...response.data,
          content: updatedContent,
        },
      };    
    }
    return {
       data: response.data 
    };
  } catch (error) {
    console.error("Error fetching joined events:", error);
    throw error;
  }
};

//API_ENDPOINTS.GET_ALL_EVENTS_CREATED_BY
export const getEventsCreated = async (
  location: LocationState,
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
    // Ensure response.data.content exists and is an array
    if (Array.isArray(response.data?.content)) {
      const updatedContent = response.data.content.map((event: Event) => ({
        ...event,
        far: calculateDistanceBetweenEventAndUserLocation(event, location),
      }));

      return {
        data: {
          ...response.data,
          content: updatedContent,
        },
      };    
    }
    return {
       data: response.data 
    };
  } catch (error) {
    console.error("Error fetching created events:", error);
    throw error;
  }
};

export const searchEventsWithFilter = async (
  searchText: string,
  params: FilterState,
  location: LocationState,
  page: number = 0,
  size: number = 10
): Promise<{
  data: {
    content: Event[];
    totalElements: number;
    totalPages: number;
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
  };
}> => {
  try {
    const axiosInstance = getAxiosInstance();
    const endpoint = API_ENDPOINTS.SEARCH_EVENTS;

    const queryParams: Record<string, string | number> = {
      page,
      size,
    };

    if (searchText) {
      queryParams.eventName = searchText;
    }

    if (params.skillLevel !== "All") {
      queryParams.requiredSkillLevel = params.skillLevel.toUpperCase();
    }

    if (params.minDate !== params.maxDate) {
      queryParams.date = addAdjustedDate(params);
    }

    if (params.filterType !== "All") {
      queryParams.sportType = params.filterType;
    }

    const response = await axiosInstance.get(endpoint, {
      params: queryParams,
    });

    const originalData = response.data;

    const updatedContent = Array.isArray(originalData.content)
      ? originalData.content.map((event: Event) => ({
          ...event,
          far: calculateDistanceBetweenEventAndUserLocation(event, location),
        }))
      : [];

    return {
      data: {
        ...originalData,
        content: updatedContent,
      },
    };
  } catch (error) {
    console.error("Error in searchEventsWithFilter:", error);
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
export const cancelEvent = async (eventId: string, reason: string) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.patch(
      API_ENDPOINTS.CANCEL_EVENT_BY_ID.replace("{id}", eventId),
      {
        reason: reason, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling event:", error);
    throw error;
  }
};
