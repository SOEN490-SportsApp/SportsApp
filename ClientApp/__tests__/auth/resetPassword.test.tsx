import React from "react";
import { Alert } from "react-native";
import ResetPassword from "@/app/auth/resetPassword";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { resetPassword } from "@/services/authService";


jest.mock("@/services/authService", () => ({
    resetPassword: jest.fn(),
  }));

describe("Forgot password test", () => {

  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockClear();
    (resetPassword as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Shows error when wrong email", async () => {
    (resetPassword as jest.Mock).mockRejectedValue(new Error("Invalid email"));
    const { getByTestId, getByText} = render(
      <Provider store={store}>
        <ResetPassword />
      </Provider>
    );
    fireEvent.changeText(getByTestId("email-input"), "invalidemail@example.com");
    fireEvent.press(getByTestId("confirmButton"));
    await waitFor(() => {
     expect(Alert.alert).toHaveBeenCalledWith("Email not found.", "User with email does not exist. Please enter a valid email.");
    });
  })

  it("Shows success when right email", async () => {
    (resetPassword as jest.Mock).mockResolvedValue({status: 200});
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ResetPassword />
      </Provider>
    );
    fireEvent.changeText(getByTestId("email-input"), "nico26@live.ca");
    fireEvent.press(getByTestId("confirmButton"));
    await waitFor(() => {
     expect(getByTestId('success-message')).toBeTruthy();
    });
  })
});
