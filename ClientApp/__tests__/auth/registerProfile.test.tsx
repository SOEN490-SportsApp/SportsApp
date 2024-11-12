import React from "react";
import { Alert } from "react-native";
import RegisterProfilePage from "@/app/auth/registerProfile";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";


jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));


describe("profile preference form test", () => {
  const mockReplace = jest.fn();
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockClear();
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it("Shows error when fields are empty", async () => {
    const { getByText } = render(<RegisterProfilePage />);

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(getByText("First name is required")).toBeTruthy();
      expect(getByText("Phone number is required")).toBeTruthy();
      expect(getByText("Gender is required")).toBeTruthy();
      expect(getByText("Postal code is required")).toBeTruthy();
      expect(getByText("Last name is required")).toBeTruthy();
      expect(getByText("Date of birth is required")).toBeTruthy();
    });
  });

  it("Shows successful creation message when successful", async () => {
    const { getByText, getByPlaceholderText, getByTestId, getAllByTestId } =
      render(<RegisterProfilePage />);

    const firstName = getByPlaceholderText("First name");
    const lastName = getByPlaceholderText("Last name");
    const phoneNumber = getByPlaceholderText("Phone number (xxx-xxx-xxxx)");
    const postalCode = getByPlaceholderText("Postal code");

    const doButton = getByTestId("dateButton");
    const gender = getByTestId("TestGenderButton");

    const rankingOptions = getAllByTestId("rankingTest");

    fireEvent.changeText(firstName, "test");
    fireEvent.changeText(lastName, "test");
    fireEvent.changeText(phoneNumber, "111-111-1111");
    fireEvent.changeText(postalCode, "H3C 0C3");
    fireEvent.press(doButton);

    const acceptableAgeTest = new Date();
    acceptableAgeTest.setFullYear(1999, 8, 3);
    // Sets date to appropriate time
    fireEvent(getByTestId("datePicker"), "onChange", {
      nativeEvent: { timestamp: acceptableAgeTest.getTime() },
    });
    fireEvent.press(getByText("Confirm"));

    // Set gender
    fireEvent.press(gender);
    fireEvent(getByTestId("genderPickerTest"), "onValueChange", "Male");

    // Set sport
    fireEvent.press(getByTestId("sportPickerButton"));
    fireEvent(getByTestId("sportPicker"), "onValueChange", "Soccer");

    // Set skill level
    fireEvent.press(rankingOptions[0]);

    fireEvent.press(getByText("Confirm"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Successful creation");
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home')
    });
  });

  it("Shows error when age is less than 16", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <RegisterProfilePage />
    );

    const firstName = getByPlaceholderText("First name");
    const lastName = getByPlaceholderText("Last name");
    const doButton = getByTestId("dateButton");

    fireEvent.changeText(firstName, "test");
    fireEvent.changeText(lastName, "test");

    fireEvent.press(doButton);

    const testDate = new Date();

    fireEvent(getByTestId("datePicker"), "onChange", {
      nativeEvent: { timestamp: testDate.getTime() },
    });
    fireEvent.press(getByText("Confirm"));
    await waitFor(() => {
      expect(getByText("Must be at least 16 years old")).toBeTruthy();
    });
  });
});
