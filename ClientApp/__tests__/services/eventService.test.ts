import axiosInstance from "@/services/axiosInstance";
import { createEvent } from "@/services/eventService";
import { API_ENDPOINTS } from "@/utils/api/endpoints";

jest.mock('@/services/axiosInstance', () => ({
  post: jest.fn(),
}));

jest.mock('@/utils/api/endpoints', () => ({
  API_ENDPOINTS: {
    CREATE_EVENT: "event-service/event",
  },
}));

describe("Event Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create an event", async () => {
    const mockResponse = { data: { success: true, eventId: "12345" } };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

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
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error("Event creation failed"));

    const eventData = {
      eventName: "Test Event",
      eventType: "public",
      location: { name: "Test Location", city: "Test City" },
    };

    await expect(createEvent(eventData)).rejects.toThrow("Event creation failed");
    expect(axiosInstance.post).toHaveBeenCalledWith(
      API_ENDPOINTS.CREATE_EVENT,
      eventData
    );
  });
});
