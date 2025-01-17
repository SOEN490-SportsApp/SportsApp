import React from "react";
import { Alert } from "react-native";
import RegisterProfilePage from "@/app/auth/registerProfile";
import supportedSports from "@/utils/constants/supportedSports";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
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

  it("Shows no error when fields are empty", async () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegisterProfilePage />
      </Provider>
    );
      const firstName = getByPlaceholderText("First name");
      const lastName = getByPlaceholderText("Last name");
      const poc = getByPlaceholderText("Postal code");
      const phoneNumber = getByPlaceholderText("Phone number (xxx-xxx-xxxx)");
      const genderText = getByText("Gender");
      const dob = getByPlaceholderText('yyyy/mm/dd')
      fireEvent.press(genderText);
      const genderPicker = await waitFor(() => getByTestId("genderPickerTest"));

    // Select an option
      fireEvent.press(genderPicker);
      fireEvent.press(getByTestId("genderPickerSubmit"))
      fireEvent.changeText(firstName, "test");
      fireEvent.changeText(lastName, "test");
      fireEvent.changeText(phoneNumber, "123-452-6782");
      fireEvent.changeText(dob, "1999/08/03");
      fireEvent.changeText(poc, "J0T 2N0")

    fireEvent.press(getByTestId('confirmButton'));

    await waitFor(() => {
      const step2element = getByText('Add your Favourite Sports')
      expect(step2element).toBeTruthy()
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


  // it('should allow selecting a ranking and confirm', async () => {
  //   const { getByText } = render(
  //     <Provider store={store}>
  //       <RegisterProfileSports onChange={mockOnChange} />
  //     </Provider>
  //   );
  //   fireEvent.press(getByText(supportedSports[0].name));

  //   await waitFor(() => getByText(`Select your skill level in ${supportedSports[0].name}`));

  //   fireEvent.press(getByText('Intermediate'));

  //   fireEvent.press(getByText('Select'));

  //   expect(mockOnChange).toHaveBeenCalledWith([
  //     { name: supportedSports[0].name, ranking: 'Intermediate' }
  //   ]);
  // });


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

  it("Go back to info page once on favourite sports page", async () => {
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

  it("Open modal", async () => {
    const mockOnChange = jest.fn();
    const { getByText, getByPlaceholderText, getByTestId, queryByText } = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    const skillOption = getByTestId("intermediate-button")
    fireEvent.press(skillOption)
    const modalNotPresent = queryByText("Select your skill level in Soccer") ;
    expect(modalNotPresent).toBeTruthy()
  })

  it("Closed modal", async () => {
    const mockOnChange = jest.fn();
    const {queryByText } = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );

    const modalNotPresent = queryByText("Select your skill level in Soccer") ;
    expect(modalNotPresent).toBeNull()
  })

  it("selects a sport intermediate skill", async () => {
    const mockOnChange = jest.fn();
    const {getByTestId,} = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    const skillOption = getByTestId("intermediate-button")
    fireEvent.press(skillOption)
    
    const confirmSport = getByTestId('confirm-sport')
    fireEvent.press(confirmSport)
    expect(mockOnChange).toHaveBeenCalledWith([{ranking: 'Intermediate', name:'Soccer'}])
  })

  it("selects a sport advanced skill", async () => {
    const mockOnChange = jest.fn();
    const {getByTestId,} = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    const skillOption = getByTestId("advanced-button")
    fireEvent.press(skillOption)
    
    const confirmSport = getByTestId('confirm-sport')
    fireEvent.press(confirmSport)
    expect(mockOnChange).toHaveBeenCalledWith([{ranking: 'Advanced', name:'Soccer'}])
  })

  it("selects a sport beginner skill", async () => {
    const mockOnChange = jest.fn();
    const {getByTestId,} = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    const skillOption = getByTestId("beginner-button")
    fireEvent.press(skillOption)
    
    const confirmSport = getByTestId('confirm-sport')
    fireEvent.press(confirmSport)
    expect(mockOnChange).toHaveBeenCalledWith([{ranking: 'Beginner', name:'Soccer'}])
  })

  it("Removes a sport", async () => {
    const mockOnChange = jest.fn();
    const {getByTestId,} = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    
    const confirmSport = getByTestId('remove-sport')
    fireEvent.press(confirmSport)
    expect(mockOnChange).toHaveBeenCalledWith([])
  })

  it("selects a sport beginner skill then removes it", async () => {
    const mockOnChange = jest.fn();
    const {getByTestId,} = render(
      <Provider store={store}>
        <RegisterProfileSports onChange={mockOnChange} />
      </Provider>
    );
    const soccerButton = getByTestId('Soccer-selection-button')
    fireEvent.press(soccerButton);
    const skillOption = getByTestId("beginner-button")
    fireEvent.press(skillOption)
    
    const confirmSport = getByTestId('confirm-sport')
    fireEvent.press(confirmSport)
    expect(mockOnChange).toHaveBeenCalledWith([{ranking: 'Beginner', name:'Soccer'}])

    fireEvent.press(soccerButton);
    
    const removeSport = getByTestId('remove-sport')
    fireEvent.press(removeSport)
    expect(mockOnChange).toHaveBeenCalledWith([])
  })




});
