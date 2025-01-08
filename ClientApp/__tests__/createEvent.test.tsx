import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";
import axiosMockAdapter from "axios-mock-adapter";
import axiosInstance from "@/services/axiosInstance";
import Create from "@/app/(tabs)/create";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { createEvent } from "@/services/eventService";
import { Alert } from "react-native";

jest.mock("@/services/eventService");

jest.spyOn(Alert, "alert").mockImplementation(() => {});

const mock = new axiosMockAdapter(axiosInstance);

describe("Create Component", () => {
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
      expect(screen.getByPlaceholderText("Enter Description")).toBeTruthy();
    });
  });

  describe("Form Validation", () => {
    test.skip("displays validation errors when required fields are empty", async () => {
      render(
        <Provider store={store}>
          <Create />
        </Provider>
      );

      fireEvent.press(screen.getByText("CREATE EVENT"));

      await waitFor(() => {
        screen.debug();

        expect(screen.getByText("Event Name is required")).toBeTruthy();
        expect(screen.getByText("Location Name is required")).toBeTruthy();
        expect(screen.getByText("City is required")).toBeTruthy();
        expect(screen.getByText("Province is required")).toBeTruthy();
        expect(
          screen.getByText("Maximum number of participants is required")
        ).toBeTruthy();
        expect(screen.getByText("Cut Off Time is required")).toBeTruthy();
        expect(screen.getByText("Description is required")).toBeTruthy();
      });
    });
  });

  describe("Form Submission", () => {
    test.skip("submits the form with valid data", async () => {
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
        screen.getByPlaceholderText("Cut Off Time"),
        "12:00 PM"
      );
      fireEvent.changeText(
        screen.getByPlaceholderText("Enter Description"),
        "Test Description"
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
            cutOffTime: "12:00 PM",
            description: "Test Description",
          })
        );
      });
    });

    test.skip("displays an error alert when the form submission fails", async () => {
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
        screen.getByPlaceholderText("Cut Off Time"),
        "12:00 PM"
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
  });
});
