import React from "react";
import { Alert } from "react-native";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import LoginPage from "@/app/auth/login";
import { getAxiosInstance } from "@/services/axiosInstance";
import { useUpdateUserToStore } from "@/state/user/actions";
import { loginUser } from "@/services/authService";
import { getUserById } from "@/state/user/api";

// mock router to prevent navigation errors in tests
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
  loginUser: jest.fn(),
}));

jest.mock("@/state/user/api", () => ({
  getUserById: jest.fn(),
}));

jest.mock("@/state/user/actions", () => ({
  useUpdateUserToStore: jest.fn(() => jest.fn()),
}));

jest.setTimeout(15000);

describe("Login Screen", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  let axiosInstance: any;
  const mockUpdateUserToStore = jest.fn();

  beforeEach(() => {
    axiosInstance = getAxiosInstance();
    jest.spyOn(Alert, "alert").mockClear();
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (useUpdateUserToStore as jest.Mock).mockReturnValue(mockUpdateUserToStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows an error when required fields are empty", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.press(getByText("Login"));

    expect(
      await screen.findByText("Email or username is required")
    ).toBeTruthy();
    expect(await screen.findByText("Password is required")).toBeTruthy();
  });

  it("calls login function when valid data is entered", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.changeText(
      getByPlaceholderText("Email/username"),
      "testuser@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
    //TODO: assert the calling of the login function when it has been implemented
  });

  it('navigates to registration page when "Register Now" is pressed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.press(getByText("Register Now"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/registerAccount");
    });
  });

  it('navigates to reset password page when "forgot password" is pressed', async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.press(getByTestId("forgot-password"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/resetPassword");
    });
  });

  it("navigates to register profile when first login", async () => {
    (loginUser as jest.Mock).mockResolvedValueOnce({
      userID: "testUserId",
    });

    // Mock getUserById response
    (getUserById as jest.Mock).mockResolvedValueOnce({
      profile: {
        firstName: "",
        lastName: "",
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    // Simulate user input and login submission
    fireEvent.changeText(
      getByPlaceholderText("Email/username"),
      "testuser@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(
        "testuser@example.com",
        "testPassword"
      );
      expect(mockUpdateUserToStore).toHaveBeenCalledWith("testUserId");
      expect(getUserById).toHaveBeenCalledWith("testUserId");
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/auth/registerProfile",
        params: { userID: "testUserId" },
      });
    });
  });

  it("navigates to home when first name and last name not empty", async () => {
    (loginUser as jest.Mock).mockResolvedValueOnce({
      userID: "testUserId",
    });

    // Mock getUserById response
    (getUserById as jest.Mock).mockResolvedValueOnce({
      profile: {
        firstName: "test",
        lastName: "test",
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    // Simulate user input and login submission
    fireEvent.changeText(
      getByPlaceholderText("Email/username"),
      "testuser@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "testPassword");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(
        "testuser@example.com",
        "testPassword"
      );
      expect(mockUpdateUserToStore).toHaveBeenCalledWith("testUserId");
      expect(getUserById).toHaveBeenCalledWith("testUserId");
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/home");
    });
  });
});
