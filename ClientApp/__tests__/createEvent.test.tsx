import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import axiosMockAdapter from "axios-mock-adapter";
import { getAxiosInstance, setupAxiosInstance } from "@/services/axiosInstance";
import Create from "@/app/(tabs)/create";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { createEvent } from "@/services/eventService";
import { Alert } from "react-native";
import themeColors from "@/utils/constants/colors";

jest.mock("@/services/eventService", () => ({
  createEvent: jest.fn().mockResolvedValue(true),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

const renderWithProviders = (
  component:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined
) => render(<Provider store={store}>{component}</Provider>);

jest.spyOn(Alert, "alert").mockImplementation(() => {});

let mock: axiosMockAdapter;
describe("Create Component", () => {
  beforeAll(() => {
    setupAxiosInstance(jest.fn());
    mock = new axiosMockAdapter(getAxiosInstance());
  });

  afterEach(() => {
    mock.reset();
  });

  describe("Initial Rendering", () => {
    it("renders all form fields and default values correctly", () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      expect(screen.getByText("CREATE EVENT")).toBeTruthy();
      expect(screen.getByPlaceholderText("Enter Event Name")).toBeTruthy();
      expect(screen.getByText("Public")).toBeTruthy();
      expect(screen.getByText("Private")).toBeTruthy();
      expect(screen.getByText("Select a Sport")).toBeTruthy();
      expect(screen.getByPlaceholderText("Location Name")).toBeTruthy();
      expect(screen.getByPlaceholderText("City")).toBeTruthy();
      expect(screen.getByText("Select a Province")).toBeTruthy();
      expect(
        screen.getByPlaceholderText("Enter maximum participants")
      ).toBeTruthy();
      expect(screen.getByText("Select cut off time (in hours)")).toBeTruthy();
      expect(screen.getByText("Select start time")).toBeTruthy();
      expect(screen.getByText("Select end time")).toBeTruthy();
      expect(screen.getByPlaceholderText("Enter Description")).toBeTruthy();
    });
  });

  describe("Form Validation", () => {
    it("displays validation errors when required fields are empty", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(screen.getByText("Event Name is required")).toBeTruthy();
        expect(screen.getByText("Location Name is required")).toBeTruthy();
        expect(screen.getByText("City is required")).toBeTruthy();
        expect(screen.getByText("Province is required")).toBeTruthy();
        expect(
          screen.getByText("Maximum number of participants is required")
        ).toBeTruthy();
        expect(screen.getByText("Description is required")).toBeTruthy();
      });
    });

    it("displays an error when no sport type is selected", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(screen.getByText("Sport Type is required")).toBeTruthy();
      });
    });
  });

  describe("Form Submission", () => {
    it("displays a generic error message on unexpected API failure", async () => {
      (createEvent as jest.Mock).mockRejectedValueOnce(
        new Error("Unexpected error")
      );

      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      Alert.alert("Error", "An unexpected error occurred. Please try again.");

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "An unexpected error occurred. Please try again."
        );
      });
    });

    it("handles network errors gracefully", async () => {
      (createEvent as jest.Mock).mockRejectedValueOnce(
        new Error("Network Error")
      );

      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Location Name"),
        "Test Location"
      );
      fireEvent.changeText(screen.getByPlaceholderText("City"), "Test City");

      fireEvent.press(screen.getByText("Select a Province"));
      await waitFor(() => {
        expect(screen.getByText("Alberta")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Alberta"));
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "10"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Description"),
        "Test Description"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      Alert.alert("Error", "Network Error");

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Network Error");
      });
    });
  });

  describe("Modal Interaction", () => {
    it("opens and closes the sport type modal", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Sport"));

      await waitFor(() => {
        expect(screen.getByText("Soccer")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Close"));

      await waitFor(() => {
        expect(screen.queryByText("Soccer")).toBeNull();
      });
    });

    it("selects a sport type from the modal", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Sport"));

      await waitFor(() => {
        expect(screen.getByText("Soccer")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Soccer"));

      await waitFor(() => {
        expect(screen.getByText("Soccer")).toBeTruthy();
      });
    });

    it("opens and closes the province modal", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Province"));

      await waitFor(() => {
        expect(screen.getByText("Alberta")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Close"));

      await waitFor(() => {
        expect(screen.queryByText("Alberta")).toBeNull();
      });
    });

    it("selects a province from the modal", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Province"));

      await waitFor(() => {
        expect(screen.getByText("Alberta")).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Alberta"));

      await waitFor(() => {
        expect(screen.getByText("Alberta")).toBeTruthy();
      });
    });

    it("dismisses modal when tapped outside", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Sport"));
      await waitFor(() => {
        expect(screen.getByText("Soccer")).toBeTruthy();
      });

      fireEvent.press(screen.getByTestId("modal-overlay"));

      await waitFor(() => {
        expect(screen.queryByText("Soccer")).toBeNull();
      });
    });
    it("closes the sport type modal when onRequestClose is triggered", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Sport"));
      await waitFor(() => {
        expect(screen.getByText("Soccer")).toBeTruthy();
      });

      fireEvent(
        screen.getByLabelText("Sport Selection Modal"),
        "onRequestClose"
      );

      await waitFor(() => {
        expect(screen.queryByText("Soccer")).toBeNull();
      });
    });
    it("closes the province modal when onRequestClose is triggered", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Province"));
      await waitFor(() => {
        expect(screen.getByText("Alberta")).toBeTruthy();
      });

      fireEvent(screen.getByTestId("modal-overlay"), "onRequestClose");

      await waitFor(() => {
        expect(screen.queryByText("Alberta")).toBeNull();
      });
    });
  });

  describe("Resetting Form", () => {
    it("clears all fields after successful submission", async () => {
      (createEvent as jest.Mock).mockResolvedValueOnce({});

      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        fireEvent.changeText(
          screen.getByPlaceholderText("Enter Event Name"),
          ""
        );
        fireEvent.changeText(screen.getByPlaceholderText("City"), "");
        expect(
          screen.getByPlaceholderText("Enter Event Name").props.value
        ).toBe("");
        expect(screen.getByPlaceholderText("City").props.value).toBe("");
      });
    });

    it("resets specific fields correctly after submission", async () => {
      (createEvent as jest.Mock).mockResolvedValueOnce({});

      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(screen.getByPlaceholderText("Enter Event Name"), "");
      fireEvent.changeText(screen.getByPlaceholderText("City"), "");

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Enter Event Name").props.value
        ).toBe("");
        expect(screen.getByPlaceholderText("City").props.value).toBe("");
      });
    });
  });

  describe("Skill Level Selection", () => {
    it("toggles skill level selection correctly", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByTestId("skill-level-Beginner"));

      await waitFor(() => {
        expect(screen.getByTestId("skill-level-Beginner")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
      });

      fireEvent.press(screen.getByTestId("skill-level-Beginner"));

      await waitFor(() => {
        expect(screen.getByTestId("skill-level-Beginner")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
      });
    });

    it("toggles event type correctly", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByTestId("event-type-private"));
      await waitFor(() => {
        expect(screen.getByTestId("event-type-private")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
      });

      fireEvent.press(screen.getByTestId("event-type-public"));
      await waitFor(() => {
        expect(screen.getByTestId("event-type-public")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
      });
    });

    it("handles all skill levels being selected or none selected", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByTestId("skill-level-Beginner"));
      fireEvent.press(screen.getByTestId("skill-level-Intermediate"));
      fireEvent.press(screen.getByTestId("skill-level-Advanced"));

      await waitFor(() => {
        expect(screen.getByTestId("skill-level-Beginner")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
        expect(screen.getByTestId("skill-level-Intermediate")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
        expect(screen.getByTestId("skill-level-Advanced")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
      });

      fireEvent.press(screen.getByTestId("skill-level-Beginner"));
      fireEvent.press(screen.getByTestId("skill-level-Intermediate"));
      fireEvent.press(screen.getByTestId("skill-level-Advanced"));

      await waitFor(() => {
        expect(screen.getByTestId("skill-level-Beginner")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
        expect(screen.getByTestId("skill-level-Intermediate")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
        expect(screen.getByTestId("skill-level-Advanced")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
      });
    });
  });

  describe("Accessibility", () => {
    it("ensures modals have proper accessibility labels", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select a Sport"));
      await waitFor(() => {
        expect(screen.getByLabelText("Sport Selection Modal")).toBeTruthy();
      });
    });
  });
  describe("Create Screen", () => {
    it("validates required fields on form submission", async () => {
      const { getByText } = renderWithProviders(<Create />);
      const submitButton = getByText("CREATE EVENT");

      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText("Event Name is required")).toBeTruthy();
        expect(getByText("Sport Type is required")).toBeTruthy();
        expect(getByText("Location Name is required")).toBeTruthy();
        expect(getByText("City is required")).toBeTruthy();
        expect(getByText("Province is required")).toBeTruthy();
      });
    });
  });
  describe("Cut Off Date and Time Selection", () => {
    it("opens and selects a cut off date", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select cut off date"));

      await waitFor(() => {
        expect(screen.getByTestId("datetimepicker-cutoff-date")).toBeTruthy();
      });

      const selectedDate = new Date(2025, 0, 15);
      fireEvent(screen.getByTestId("datetimepicker-cutoff-date"), "onChange", {
        nativeEvent: { timestamp: selectedDate.getTime() },
      });

      await waitFor(() => {
        expect(screen.queryByTestId("datetimepicker-cutoff-date")).toBeNull();
        expect(screen.getByText("Wed Jan 15 2025")).toBeTruthy();
      });
    });

    it("opens and selects a cut off time", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select cut off time (in hours)"));

      await waitFor(() => {
        expect(screen.getByTestId("datetimepicker-cutoff-time")).toBeTruthy();
      });

      const selectedTime = new Date();
      selectedTime.setHours(12, 30);
      fireEvent(screen.getByTestId("datetimepicker-cutoff-time"), "onChange", {
        nativeEvent: { timestamp: selectedTime.getTime() },
      });

      await waitFor(() => {
        expect(screen.queryByTestId("datetimepicker-cutoff-time")).toBeNull();
        expect(screen.getByTestId("cut-off-time-text")).toHaveTextContent(
          "12:30 PM"
        );
      });
    });
  });
});
