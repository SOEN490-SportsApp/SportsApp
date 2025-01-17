import React, { act } from "react";
import { Alert } from "react-native";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import RegisterAccountPage from "@/app/auth/registerAccount";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/authService";
import { getAxiosInstance } from "@/services/axiosInstance";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/axiosInstance", () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    put: jest.fn(),
  };
  return {
    getAxiosInstance: jest.fn(() => mockAxiosInstance),
  };
});

jest.mock("@/services/authService", () => ({
  registerUser: jest.fn(),
}));

describe("Register Account Screen", () => {
  let axiosInstance: any;
  const mockPush = jest.fn();
  const mockReplace = jest.fn()

  beforeAll(() => {
    axiosInstance = getAxiosInstance();
  });
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows an error when required fields are empty", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <RegisterAccountPage />
      </Provider>
    );

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Username is required")).toBeTruthy();
      expect(getByText("Email is required")).toBeTruthy();
      expect(getByText("Password is required")).toBeTruthy();
      expect(getByText("Please confirm your password")).toBeTruthy();
    });
  });

  it("shows an alert when terms not accepted", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegisterAccountPage />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "testUser");
    fireEvent.changeText(getByPlaceholderText("Email"), "testuser@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.changeText(
      getByPlaceholderText("Confirm Password"),
      "testPassword"
    );
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "",
        "You must agree to the terms to continue."
      );
    });
  });

  it("shows an alert when passwords do not match", async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterAccountPage />);

    fireEvent.changeText(getByPlaceholderText("Username"), "testUser");
    fireEvent.changeText(getByPlaceholderText("Email"), "testuser@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.changeText(
      getByPlaceholderText("Confirm Password"),
      "differentTestPassword"
    );
    fireEvent.press(await screen.findByTestId("agreeToTermsCheckbox"));
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Oh oh!",
        "Passwords do not match."
      );
    });
  });

  it("Should push to login after successful creation of account", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (registerUser as jest.Mock).mockResolvedValue({ data: { id: "123" } });

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <Provider store={store}>
        <RegisterAccountPage />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "testUser");
    fireEvent.changeText(getByPlaceholderText("Email"), "testuser@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.changeText(
      getByPlaceholderText("Confirm Password"),
      "testPassword"
    );
    const agreeToTermsCheckbox = getByTestId("agreeToTermsCheckbox");
    act(() => {
      fireEvent.press(agreeToTermsCheckbox);
    });
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith("testuser@example.com", "testUser", "testPassword");
        expect(mockPush).toHaveBeenCalledWith("/auth/login");
    })
  });

  it('navigates to login page when "already have account" is pressed"', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <RegisterAccountPage />
      </Provider>
    );

    fireEvent.press(getByTestId("account-already-created"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    });
  });
});
