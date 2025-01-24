import { getAxiosInstance } from "@/services/axiosInstance";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
} from "@/services/eventService";
import { API_ENDPOINTS } from "@/utils/api/endpoints";

jest.mock("@/services/axiosInstance", () => ({
  getAxiosInstance: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock("@/utils/api/endpoints", () => ({
  API_ENDPOINTS: {
    CREATE_EVENT: "event-service/event",
    GET_ALL_EVENTS: "event-service/events",
    DELETE_EVENT_BY_ID: "event-service/event/{id}",
  },
}));

describe("Event Service Tests", () => {
  let axiosInstance: any;

  beforeEach(() => {
    axiosInstance = getAxiosInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should successfully create an event", async () => {
      const mockResponse = { data: { success: true, eventId: "12345" } };
      axiosInstance.post.mockResolvedValueOnce(mockResponse);

      const eventData = {
        eventName: "Test Event",
        eventType: "public",
        location: { name: "Test Location", city: "Test City" },
      };

      const result = await createEvent(eventData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.CREATE_EVENT,
        eventData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when event creation fails", async () => {
      axiosInstance.post.mockRejectedValueOnce(
        new Error("Event creation failed")
      );

      const eventData = {
        eventName: "Test Event",
        eventType: "public",
        location: { name: "Test Location", city: "Test City" },
      };

      await expect(createEvent(eventData)).rejects.toThrow(
        "Event creation failed"
      );
      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.CREATE_EVENT,
        eventData
      );
    });
  });

  describe("getAllEvents", () => {
    it("should successfully fetch all events", async () => {
      const mockResponse = { data: [{ id: "1", eventName: "Event 1" }] };
      axiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await getAllEvents();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        API_ENDPOINTS.GET_ALL_EVENTS
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when fetching events fails", async () => {
      axiosInstance.get.mockRejectedValueOnce(
        new Error("Failed to fetch events")
      );

      await expect(getAllEvents()).rejects.toThrow("Failed to fetch events");
      expect(axiosInstance.get).toHaveBeenCalledWith(
        API_ENDPOINTS.GET_ALL_EVENTS
      );
    });
  });

  jest.mock("axios");
  axiosInstance.delete = jest.fn();

  describe("deleteEvent", () => {
    it("should throw an error if event deletion fails", async () => {
      const eventId = "12345";
      axiosInstance.delete.mockRejectedValue(
        new Error("Event deletion failed")
      );

      await expect(deleteEvent(eventId)).rejects.toThrow(
        "Event deletion failed"
      );
      expect(axiosInstance.delete).toHaveBeenCalledWith(
        API_ENDPOINTS.DELETE_EVENT_BY_ID.replace("{id}", eventId)
      );
    });
  });
});
