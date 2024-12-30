import axiosInstance from "@/services/axiosInstance";
import { createEvent } from "@/services/eventService";

jest.mock('@/services/axiosInstance', () => ({
  post: jest.fn(),
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
      "https://api-dev.sportahub.app/api/event-service/event",
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
      "https://api-dev.sportahub.app/api/event-service/event",
      eventData
    );
  });
});
