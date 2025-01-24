import { getAxiosInstance } from "@/services/axiosInstance";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
} from "@/services/eventService";
import { API_ENDPOINTS } from "@/utils/api/endpoints";

// Mock the axios instance and its methods
const mockPost = jest.fn();
const mockGet = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/services/axiosInstance", () => ({
  getAxiosInstance: jest.fn(() => ({
    post: mockPost,
    get: mockGet,
    delete: mockDelete,
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
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock call data before each test
  });

  describe("createEvent", () => {
    it("should successfully create an event", async () => {
      const mockResponse = { data: { success: true, eventId: "12345" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const eventData = {
        eventName: "Test Event",
        eventType: "public",
        location: { name: "Test Location", city: "Test City" },
      };

      const result = await createEvent(eventData);

      expect(mockPost).toHaveBeenCalledWith(
        API_ENDPOINTS.CREATE_EVENT,
        eventData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when event creation fails", async () => {
      const error = new Error("Event creation failed");
      mockPost.mockRejectedValueOnce(error);

      const eventData = {
        eventName: "Test Event",
        eventType: "public",
        location: { name: "Test Location", city: "Test City" },
      };

      await expect(createEvent(eventData)).rejects.toThrow(
        "Event creation failed"
      );
      expect(mockPost).toHaveBeenCalledWith(
        API_ENDPOINTS.CREATE_EVENT,
        eventData
      );
    });
  });

  describe("getAllEvents", () => {
    it("should successfully fetch all events", async () => {
      const mockResponse = { data: [{ id: "1", eventName: "Event 1" }] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getAllEvents();

      expect(mockGet).toHaveBeenCalledWith(API_ENDPOINTS.GET_ALL_EVENTS);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when fetching events fails", async () => {
      const error = new Error("Failed to fetch events");
      mockGet.mockRejectedValueOnce(error);

      await expect(getAllEvents()).rejects.toThrow("Failed to fetch events");
      expect(mockGet).toHaveBeenCalledWith(API_ENDPOINTS.GET_ALL_EVENTS);
    });
  });

  describe("deleteEvent", () => {
    it("should successfully delete an event", async () => {
      const mockResponse = { data: { success: true } };
      mockDelete.mockResolvedValueOnce(mockResponse);

      const eventId = "12345";
      const result = await deleteEvent(eventId);

      expect(mockDelete).toHaveBeenCalledWith(
        API_ENDPOINTS.DELETE_EVENT_BY_ID.replace("{id}", eventId)
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error when deleting an event fails", async () => {
      const error = new Error("Event deletion failed");
      mockDelete.mockRejectedValueOnce(error);

      const eventId = "12345";

      await expect(deleteEvent(eventId)).rejects.toThrow(
        "Event deletion failed"
      );
      expect(mockDelete).toHaveBeenCalledWith(
        API_ENDPOINTS.DELETE_EVENT_BY_ID.replace("{id}", eventId)
      );
    });
  });
});
