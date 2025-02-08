import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import QR from "@/components/QR/QR";
import * as Linking from "expo-linking";
import QRCode from "react-native-qrcode-svg";

jest.mock("expo-linking", () => ({
    canOpenURL: jest.fn(() => Promise.resolve(true)), 
  }));

describe("QR Component", () => {
  const mockSetIsVisible = jest.fn();
jest.mock("react-native-qrcode-svg", () => jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    const { getByText } = render(
      <QR id="123" isVisible={true} isProfile={false} setIsVisible={mockSetIsVisible} />
    );

    expect(getByText("Share your event with friends")).toBeTruthy();
  });

  test("modal is visible when isVisible is true", () => {
    const { getByTestId } = render(
      <QR id="123" isVisible={true} isProfile={false} setIsVisible={mockSetIsVisible} />
    );

    expect(getByTestId("QRCode")).toBeTruthy();
  });

//   test("modal is not visible when isVisible is false", () => {
//     const { queryByTestId } = render(
//       <QR id="123" isVisible={false} isProfile={false} setIsVisible={mockSetIsVisible} />
//     );

//     expect(queryByTestId("QRCode")).toBeNull();
//   });

//   test("QR code contains correct event URL", () => {
//     const { getByTestId } = render(
//       <QR id="123" isVisible={true} isProfile={false} setIsVisible={mockSetIsVisible} />
//     );

//     expect(getByTestId("QRCode").props.value).toBe(`myapp://events/456`);
//   });

//   test("QR code contains correct profile URL", async () => {
//     const mockSetIsVisible = jest.fn();
//     const { getByTestId } = render(
//       <QR id="123" isVisible={true} isProfile={true} setIsVisible={mockSetIsVisible} />
//     );

//     const svgElement = getByTestId("QRCode").findByType("svg");

//   // Log the SVG element to check its structure
//   console.log(svgElement.props);
//     expect(svgElement).toBe("myapp://(tabs)/home/userProfiles/456");
    
//   });

  test("clicking outside modal calls setIsVisible(false)", () => {
    const { getByTestId } = render(
      <QR id="123" isVisible={true} isProfile={false} setIsVisible={mockSetIsVisible} />
    );

    fireEvent.press(getByTestId("modalOverlay"));
    expect(mockSetIsVisible).toHaveBeenCalledWith(false);
  });

  test("Linking.canOpenURL updates state properly", async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);

    render(<QR id="123" isVisible={true} isProfile={false} setIsVisible={mockSetIsVisible} />);

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith("myapp://");
    });
  });
});
