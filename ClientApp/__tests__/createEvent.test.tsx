import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import "@testing-library/jest-dom/extend-expect";
import axiosMockAdapter from "axios-mock-adapter";
import { getAxiosInstance, setupAxiosInstance } from "@/services/axiosInstance";
import Create from "@/app/(tabs)/create";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { createEvent } from "@/services/eventService";
import { Alert } from "react-native";
import themeColors from "@/utils/constants/colors";

jest.mock("@/services/eventService");

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

    it("displays an error when maxParticipants is non-numeric", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "invalid"
      );
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(
          screen.getByText("Must be a positive integer greater than 0")
        ).toBeTruthy();
      });
    });

    it("displays an error when end time is before start time", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );
      fireEvent.press(screen.getByText("Select start time"));
      fireEvent.changeText(
        screen.getByPlaceholderText("Select start time"),
        "22:00"
      );
      fireEvent.press(screen.getByText("Select end time"));
      fireEvent.changeText(
        screen.getByPlaceholderText("Select end time"),
        "21:00"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "End time must be after start time."
        );
      });
    });

    it("displays an error when required date/time fields are missing", async () => {
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
      fireEvent.changeText(
        screen.getByPlaceholderText("Province"),
        "Test Province"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "10"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Description"),
        "Test Description"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Please select all date and time fields"
        );
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

    it("displays an error when invalid date format is entered", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(screen.getByText("Select start time"), "invalid");
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Invalid date format."
        );
      });
    });

    it("displays an error when no skill level is selected", async () => {
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
        expect(
          screen.getByText("At least one skill level is required")
        ).toBeTruthy();
      });
    });

    it("displays an error when event date is missing", async () => {
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
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Please select all date and time fields"
        );
      });
    });

    it("displays an error when maxParticipants is invalid", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "-5"
      );
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(
          screen.getByText("Must be a positive integer greater than 0")
        ).toBeTruthy();
      });
    });

    it("displays an error for invalid time format", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Select start time"));
      fireEvent.changeText(
        screen.getByPlaceholderText("Select start time"),
        "25:00"
      );

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Time must be in HH:MM format."
        );
      });
    });

    it("displays an error when an unsupported province is selected", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Event Name"),
        "Test Event"
      );
      fireEvent.changeText(screen.getByPlaceholderText("City"), "Test City");
      fireEvent.changeText(
        screen.getByPlaceholderText("Province"),
        "Invalid Province"
      );
      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Province is invalid."
        );
      });
    });
  });

  describe("Form Interaction", () => {
    it("toggles event type correctly", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Private"));
      await waitFor(() => {
        expect(screen.getByText("Private")).toHaveStyle({
          backgroundColor: themeColors.primary, // Primary color
        });
      });

      fireEvent.press(screen.getByText("Public"));
      await waitFor(() => {
        expect(screen.getByText("Public")).toHaveStyle({
          backgroundColor: themeColors.primary, // Primary color
        });
      });
    });
  });

  describe("Form Submission", () => {
    it("submits the form with valid data", async () => {
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
      fireEvent.changeText(
        screen.getByPlaceholderText("Location Name"),
        "Test Location"
      );
      fireEvent.changeText(screen.getByPlaceholderText("City"), "Test City");
      fireEvent.changeText(
        screen.getByPlaceholderText("Province"),
        "Test Province"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "10"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Description"),
        "Test Description"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Select start time"),
        "08:00"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Select end time"),
        "10:00"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Cut Off Time"),
        "2025-01-25T03:06:00.000Z"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(createEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            eventName: "Test Event",
            location: expect.objectContaining({
              name: "Test Location",
              city: "Test City",
              province: "Test Province",
            }),
            maxParticipants: "10",
            description: "Test Description",
            startTime: "08:00",
            endTime: "10:00",
            cutOffTime: "2025-01-25T03:06:00.000Z",
          })
        );
      });
    });

    it("displays an error alert when the form submission fails", async () => {
      (createEvent as jest.Mock).mockRejectedValueOnce(
        new Error("Error occurred while creating the event")
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
      fireEvent.changeText(
        screen.getByPlaceholderText("Province"),
        "Test Province"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter maximum participants"),
        "10"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Description"),
        "Test Description"
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Error occurred while creating the event"
        );
      });
    });

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
      fireEvent.press(screen.getByText("CREATE EVENT"));

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

      fireEvent.press(screen.getByTestId("modal-overlay")); // Assume overlay has a testID of "modal-overlay"
      await waitFor(() => {
        expect(screen.queryByText("Soccer")).toBeNull();
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
        expect(
          screen.getByPlaceholderText("Enter Event Name").props.value
        ).toBe("");
      });
    });

    it("resets specific fields correctly after submission", async () => {
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
      fireEvent.changeText(screen.getByPlaceholderText("City"), "Test City");

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

      fireEvent.press(screen.getByText("Beginner"));

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toHaveStyle({
          backgroundColor: themeColors.primary, // Assuming primary color is blue
        });
      });

      fireEvent.press(screen.getByText("Beginner"));

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toHaveStyle({
          backgroundColor: themeColors.primary, // Assuming default color is light grey
        });
      });
    });

    it("toggles event type correctly", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("Private"));
      await waitFor(() => {
        expect(screen.getByText("Private")).toHaveStyle({
          backgroundColor: themeColors.primary, // Primary color
        });
      });

      fireEvent.press(screen.getByText("Public"));
      await waitFor(() => {
        expect(screen.getByText("Public")).toHaveStyle({
          backgroundColor: themeColors.primary, // Primary color
        });
      });
    });

    it("handles all skill levels being selected or none selected", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      // Select all skill levels
      fireEvent.press(screen.getByText("Beginner"));
      fireEvent.press(screen.getByText("Intermediate"));
      fireEvent.press(screen.getByText("Advanced"));

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
        expect(screen.getByText("Intermediate")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
        expect(screen.getByText("Advanced")).toHaveStyle({
          backgroundColor: themeColors.primary,
        });
      });

      // Deselect all skill levels
      fireEvent.press(screen.getByText("Beginner"));
      fireEvent.press(screen.getByText("Intermediate"));
      fireEvent.press(screen.getByText("Advanced"));

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
        expect(screen.getByText("Intermediate")).toHaveStyle({
          backgroundColor: themeColors.background.lightGrey,
        });
        expect(screen.getByText("Advanced")).toHaveStyle({
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
});
