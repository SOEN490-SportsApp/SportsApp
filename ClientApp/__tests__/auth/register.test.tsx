import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../app/auth/register';
import { getRole } from '@testing-library/react-native/build/helpers/accessibility';

describe('Register Screen', () => {

    beforeEach(() => {
        jest.spyOn(Alert, 'alert').mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows an error when required fields are empty', async () => {
        const { getByText } = render(<Register />);

        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(getByText('Username is required')).toBeTruthy();
            expect(getByText('Email is required')).toBeTruthy();
            expect(getByText('Password is required')).toBeTruthy();
            expect(getByText('Please confirm your password')).toBeTruthy();
        });
    });

    it('shows an alert when terms not accepted', async () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
        fireEvent.changeText(getByPlaceholderText('Email'), 'testuser@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'testPassword');
        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("", "You must agree to the terms to continue.");
        });
    });

    it('shows an alert when passwords do not match', async () => {
        const { getByPlaceholderText, getByText } = render(<Register />);

        fireEvent.changeText(getByPlaceholderText('Username'), 'testUser');
        fireEvent.changeText(getByPlaceholderText('Email'), 'testuser@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'differentTestPassword');
        fireEvent.press(await screen.findByTestId('agreeToTermsCheckbox'));
        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Oh oh!", "Passwords do not match.");
        });
    });
});


