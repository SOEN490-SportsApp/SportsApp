import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import EventDetails from "@/app/events/[eventId]";
import axiosInstance from "@/services/axiosInstance";
import { useSelector } from "react-redux";
import { API_ENDPOINTS } from "@/utils/api/endpoints";
import { router } from "expo-router";

// Mock dependencies
jest.mock("@/services/axiosInstance");
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({ back: jest.fn() })),
  useLocalSearchParams: jest.fn(() => ({ eventId: "123" })),
}));

describe("EventDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent = {
    id: "123",
    eventName: "Soccer Match",
    locationResponse: {
      streetNumber: "123",
      streetName: "Main St",
      city: "Springfield",
      province: "IL",
    },
    requiredSkillLevel: ["Intermediate"],
    isPrivate: false,
    date: "2024-12-31",
    description: "A fun soccer match!",
    participants: [
      { userId: "1", attendStatus: null },
      { userId: "2", attendStatus: null },
    ],
    maxParticipants: 10,
    cutOffTime: "4",
    sportType: "Soccer",
  };

  const mockUser = { id: "1", name: "John Doe" };

  it("renders the loader while fetching data", () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: null });

    const { getByTestId } = render(<EventDetails />);
    expect(getByTestId("loader")).toBeTruthy();
  });

  it("renders error message when fetching event details fails", async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch event details.")).toBeTruthy();
    });
  });

  it("renders event details successfully", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByText(mockEvent.eventName)).toBeTruthy();
      expect(
        screen.getByText(
          `${mockEvent.locationResponse.streetNumber} ${mockEvent.locationResponse.streetName}, ${mockEvent.locationResponse.city}, ${mockEvent.locationResponse.province}`
        )
      ).toBeTruthy();
      expect(screen.getByText(mockEvent.description)).toBeTruthy();
    });
  });

  it("shows the 'Join Event' button if user is not a participant", async () => {
    const nonParticipantEvent = { ...mockEvent, participants: [] };
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: nonParticipantEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.getByText("Join Event")).toBeTruthy();
    });
  });

  it("does not show the 'Join Event' button if user is a participant", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      expect(screen.queryByText("Join Event")).toBeNull();
    });
  });

  it("renders participant avatars correctly", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockEvent });
    (useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(<EventDetails />);
    await waitFor(() => {
      const participants = screen.getAllByTestId("participant-avatar");
      expect(participants.length).toBe(mockEvent.participants.length);
    });
  });
});
