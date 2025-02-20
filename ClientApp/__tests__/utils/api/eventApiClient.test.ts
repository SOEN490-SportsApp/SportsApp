import { getEventById, joinEvent } from "@/utils/api/eventApiClient";
import { getAxiosInstance } from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { Event } from "@/types/event";

jest.mock("@/services/axiosInstance");

const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
};
(getAxiosInstance as jest.Mock).mockReturnValue(mockAxios);

describe("Event Service", () => {
  const eventId = "123";
  const userId = "456";
  
  const mockEvent: Event = {
    id: eventId,
    eventName: "Test Event",
    eventType: "Casual",
    sportType: "Soccer",
    date: "2025-02-20",
    description: "A friendly soccer match.",
    cutOffTime: "2025-02-19T18:00:00Z",
    requiredSkillLevel: ["Intermediate"],
    maxParticipants: 10,
    participants: [
      { userId: "789", attendStatus: "JOINED", joinedOn: "2025-02-15T12:00:00Z" },
    ],
    locationResponse: {
      name: "Local Stadium",
      streetNumber: "123",
      streetName: "Main St",
      city: "New York",
      province: "NY",
      country: "USA",
      postalCode: "10001",
      latitude: "40.7128",
      longitude: "-74.0060",
    },
    createdBy: "admin123",
    teams: [{ teamId: "team123" }],
    isPrivate: false,
    whitelistedUsers: ["user789"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getEventById", () => {
    it("should fetch an event successfully", async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockEvent });

      const result = await getEventById(eventId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        API_ENDPOINTS.GET_EVENT_BY_ID.replace("{id}", eventId)
      );
      expect(result).toEqual(mockEvent);
    });

    it("should throw an error if fetching an event fails", async () => {
      const mockError = { response: { data: "Event not found" } };
      mockAxios.get.mockRejectedValueOnce(mockError);

      await expect(getEventById(eventId)).rejects.toEqual("Event not found");
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("joinEvent", () => {
    it("should successfully send a request to join an event", async () => {
      mockAxios.post.mockResolvedValueOnce({});

      await expect(joinEvent(eventId, userId)).resolves.not.toThrow();

      expect(mockAxios.post).toHaveBeenCalledWith(
        API_ENDPOINTS.JOIN_EVENT_BY_ID.replace("{id}", eventId),
        null,
        { params: { userId } }
      );
    });

    it("should throw an error if joining an event fails", async () => {
      const mockError = { response: { data: "Failed to join event" } };
      mockAxios.post.mockRejectedValueOnce(mockError);

      await expect(joinEvent(eventId, userId)).rejects.toEqual("Failed to join event");
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});
