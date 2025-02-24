import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import ProfilePage from "../../app/userProfiles/[id]";
import { getOtherUserProfile, getEventsByUserId } from "@/utils/api/profileApiClient";
import { useLocalSearchParams } from "expo-router";

jest.mock("@/utils/api/profileApiClient", () => ({
    getOtherUserProfile: jest.fn(),
    getEventsByUserId: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useLocalSearchParams: jest.fn(),
    router: {
        push: jest.fn(),
    },
}));

describe("ProfilePage", () => {
    const mockUser = {
        profile: {
            firstName: "John",
            lastName: "Doe",
            gender: "Male",
            phoneNumber: "1234567890",
        },
        username: "johndoe",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loading state initially", async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ userId: "123" });

        const { getByTestId } = render(<ProfilePage />);
        expect(getByTestId("loading")).toBeTruthy();
    });

    test("renders error state when user data fails to load", async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ userId: "123" });
        (getOtherUserProfile as jest.Mock).mockRejectedValue(new Error("Network error"));

        const { getByText } = render(<ProfilePage />);

        await waitFor(() => expect(getByText("Failed to load user data")).toBeTruthy());
    });



    test("renders no events found when events list is empty", async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ userId: "123" });
        (getOtherUserProfile as jest.Mock).mockResolvedValue(mockUser);
        (getEventsByUserId as jest.Mock).mockResolvedValue({ content: [] });

        const { getByText } = render(<ProfilePage />);

        await waitFor(() => expect(getByText("No events found")).toBeTruthy());
    });
});
