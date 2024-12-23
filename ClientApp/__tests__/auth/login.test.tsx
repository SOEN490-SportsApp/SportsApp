import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import LoginPage from '@/app/auth/login';

// mock router to prevent navigation errors in tests
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.setTimeout(15000);

describe('Login Screen', () => {
    const mockPush = jest.fn();
    const mockReplace = jest.fn();

    beforeEach(() => {
        jest.spyOn(Alert, 'alert').mockClear();
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            replace: mockReplace,
        });
    });

    it('shows an error when required fields are empty', async () => {
        const { getByText } = render(
            <Provider store={store}>
                <LoginPage />
            </Provider>
        );

        fireEvent.press(getByText('Login'));

        expect(await screen.findByText('Email or username is required')).toBeTruthy();
        expect(await screen.findByText('Password is required')).toBeTruthy();
    });

    it('calls login function when valid data is entered', async () => {
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <LoginPage />
            </Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email/username'), 'testuser@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
        fireEvent.press(getByText('Login'));

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

        fireEvent.press(getByText('Register Now'));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/auth/registerAccount');
        });
    });
});
