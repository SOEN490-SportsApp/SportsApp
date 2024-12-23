import React from "react";
import { Alert } from "react-native";
import RegisterProfilePage from "@/app/auth/registerProfile";
import supportedSports from "@/utils/constants/supportedSports";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MultiSelectDropdown from "@/components/RegisterProfile/RegisterProfileSports";
import RegisterProfileSports from "@/components/RegisterProfile/RegisterProfileSports";
import { Provider } from "react-redux";
import { store } from "@/state/store";

describe("profile preference form test", () => {
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnChange = jest.fn();
    jest.spyOn(Alert, "alert").mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Shows error when fields are empty", async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );

    fireEvent.press(getByTestId('confirmButton'));

    await waitFor(() => {
      expect(getByText("First name is required")).toBeTruthy();
      expect(getByText("Last name is required")).toBeTruthy();
      expect(getByText("Date of birth is required")).toBeTruthy();
    });
  });

  it("Shows error when phone number format is invalid", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );

    const phoneNumber = getByPlaceholderText("Phone number (xxx-xxx-xxxx)");
    const doButton = getByTestId("confirmButton");

    fireEvent.changeText(phoneNumber, "123-45-678");
    fireEvent.press(doButton);

    await waitFor(() => {
      expect(getByText("Enter valid format xxx-xxx-xxxx")).toBeTruthy();
    });
  });

  it("Allows gender selection", async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );

    const genderText = getByText("Gender");

    // Simulate opening gender picker
    fireEvent.press(genderText);
    const genderPicker = await waitFor(() => getByTestId("genderPickerTest"));

    // Select an option
    fireEvent.press(genderPicker);
    fireEvent.press(getByTestId("genderPickerSubmit"))

    await waitFor(() => {
      expect(genderText).toHaveTextContent("Male");
    });
  });


  it('should allow selecting a ranking and confirm', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    fireEvent.press(getByText(supportedSports[0].name));

    await waitFor(() => getByText(`Select your skill level in ${supportedSports[0].name}`));

    fireEvent.press(getByText('Intermediate'));

    fireEvent.press(getByText('Select'));

    expect(mockOnChange).toHaveBeenCalledWith([
      { name: supportedSports[0].name, ranking: 'Intermediate' }
    ]);
  });


  // it("shows no errors when fields are properly inputted", async() => {
  //   const { getByText, getByTestId, getByPlaceholderText } = render(
  //     <AuthProvider>
  //       <RegisterProfilePage />
  //     </AuthProvider>
  //   );
  //   const firstName = getByPlaceholderText("First name");
  //   const lastName = getByPlaceholderText("Last name");
  //   const phoneNumber = getByPlaceholderText("Phone number (xxx-xxx-xxxx)");
  //   const genderText = getByText("Gender");
  //   const dob = getByPlaceholderText('yyyy/mm/dd')
  //   const postalCode = getByPlaceholderText("")
  //   fireEvent.press(genderText); // This triggers the modal to open

  //   // Wait for the picker to appear in the modal
  //   const genderPicker = await waitFor(() => getByTestId("genderPickerTest"));

  //   // Now interact with the gender picker and select an option
  //   act(() => {
  //     fireEvent.press(genderText); // This triggers the modal to open
  //   });

  //   fireEvent.changeText(dob, '2024-08-03')
  //   fireEvent.changeText(firstName, "test");
  //   fireEvent.changeText(lastName, "test");
  //   fireEvent.changeText(phoneNumber, "819-323-1853");
  //   fireEvent.changeText(postalCode, "jot2n0")
  //   await waitFor(() => {
  //     expect(getByText("First name is required")).toBeFalsy();
  //     expect(getByText("Last name is required")).toBeFalsy();
  //     expect(getByText("Date of birth is required")).toBeFalsy();
  //     expect(getByText("Phone number is required")).toBeFalsy();
  //     expect(getByText("Postal code is required")).toBeFalsy();
  //     expect(getByText("Gender is required")).toBeFalsy()
  //   });
  // })

  it("Shows error when age is less than 16", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );

    const doButton = getByTestId("confirmButton");
    const dob = getByPlaceholderText('yyyy/mm/dd')
    fireEvent.changeText(dob, '2024-08-03')
    fireEvent.press(doButton);

    await waitFor(() => {
      expect(getByText("Must be at least 16 years old")).toBeTruthy();
    });
  });

  it("Shows error when date of birth invalid", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );

    const doButton = getByTestId("confirmButton");
    const dob = getByPlaceholderText('   yyyy/mm/dd')
    fireEvent.changeText(dob, '2000-00-00')
    fireEvent.press(doButton);

    await waitFor(() => {
      expect(getByText("Enter a valid date")).toBeTruthy();
    });
  });

});
