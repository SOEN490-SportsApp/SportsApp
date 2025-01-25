import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TopBar from "../../components/Home Page/TopBar"; // Adjust the import path based on your project structure
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("TopBar Component", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    // Mock useRouter's return value
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the TopBar component correctly", () => {
    const { getByText, getByTestId } = render(<TopBar />);

    // Check if the logo text is present
    expect(getByText("Sporta")).toBeTruthy();

    // Check if search and comment icons exist
    expect(getByTestId("search-icon")).toBeTruthy();
  });

  it("should handle search icon press", () => {
    const { getByTestId } = render(<TopBar />);
    const searchIcon = getByTestId("search-icon");

    fireEvent.press(searchIcon);
    expect(searchIcon).toBeTruthy(); // Ensure button press doesn't throw errors
  });
});
