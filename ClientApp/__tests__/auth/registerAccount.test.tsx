import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterAccountPage from '@/app/auth/registerAccount';
import { AuthProvider } from '@/utils/context/AuthContext';

describe('Register Account Screen', () => {

    beforeEach(() => {
        jest.spyOn(Alert, 'alert').mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows an error when required fields are empty', async () => {
        const { getByText } = render(
            <AuthProvider>
                <RegisterAccountPage />
            </AuthProvider>   
    );

        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(getByText('Username is required')).toBeTruthy();
            expect(getByText('Email is required')).toBeTruthy();
            expect(getByText('Password is required')).toBeTruthy();
            expect(getByText('Please confirm your password')).toBeTruthy();
        });
    });

    // it('shows an alert when terms not accepted', async () => {
    //     const { getByPlaceholderText, getByText } = render(
    //     <AuthProvider>
    //         <RegisterAccountPage />
    //     </AuthProvider>
    //     );

    //     fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
    //     fireEvent.changeText(getByPlaceholderText('Email'), 'testuser@example.com');
    //     fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
    //     fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'testPassword');
    //     fireEvent.press(getByText('Sign Up'));

    //     await waitFor(() => {
    //         expect(Alert.alert).toHaveBeenCalledWith("", "You must agree to the terms to continue.");
    //     });
    // });

    // it('shows an alert when passwords do not match', async () => {
    //     const { getByPlaceholderText, getByText } = render(<RegisterAccountPage />);

    //     fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
    //     fireEvent.changeText(getByPlaceholderText('Email'), 'testuser@example.com');
    //     fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
    //     fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'differentTestPassword');
    //     fireEvent.press(await screen.findByTestId('agreeToTermsCheckbox'));
    //     fireEvent.press(getByText('Sign Up'));

    //     await waitFor(() => {
    //         expect(Alert.alert).toHaveBeenCalledWith("Oh oh!", "Passwords do not match.");
    //     });
    // });
});


