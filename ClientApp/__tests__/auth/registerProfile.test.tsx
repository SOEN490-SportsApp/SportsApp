import React from "react";
import { Alert } from "react-native";
import RegisterProfilePage from "@/app/auth/registerProfile";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";

describe("profile preference form test", () => {
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Shows error when fields are empty", async () => {
    const { getByText } = render(<RegisterProfilePage />);

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(getByText("First name is required")).toBeTruthy();
      expect(getByText("Last name is required")).toBeTruthy();
      expect(getByText("Date of birth is required")).toBeTruthy();
    });
  });

  it("Shows error when age is less than 16", async () => {
    const {
      getByText,
      getByPlaceholderText,
      getByTestId,
      debug,
      findAllByText,
    } = render(<RegisterProfilePage />);

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

  // it("Shows no error when age is greater than 16 and fields are filled", async () => {
  //   jest.spyOn(Alert, "alert").mockImplementation(() => {});
  //   const {
  //     getByText,
  //     getByPlaceholderText,
  //     getByTestId,
  //     debug,
  //     findAllByText,
  //   } = render(<ProfilePreferenceForm />);

  //   const firstName = getByPlaceholderText("First name");
  //   const lastName = getByPlaceholderText("Last name");
  //   const doButton = getByTestId("dateButton");
  //   const phoneNumber = getByPlaceholderText("Phone number (xxx-xxx-xxxx)");
  //   fireEvent.changeText(firstName, "test");
  //   fireEvent.changeText(lastName, "test");
  //   fireEvent.changeText(phoneNumber, "test");

  //   fireEvent.press(doButton);

  //   const testDate = new Date();
  //   testDate.setFullYear(1999);
  //   fireEvent(getByTestId("datePicker"), "onChange", {
  //     nativeEvent: { timestamp: testDate.getTime() },
  //   });
  //   const confirmButton = getByText("Confirm");

  //   expect(confirmButton).toBeTruthy();
  //   fireEvent.press(confirmButton);
  //   await waitFor(() => {
  //     expect(Alert.alert).toHaveBeenCalledWith(
  //       "Successful creation",
  //       "moving forward"
  //     );
  //   });
  // });
});
