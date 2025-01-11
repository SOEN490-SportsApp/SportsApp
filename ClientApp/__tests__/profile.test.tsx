import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import axiosMockAdapter from 'axios-mock-adapter';
import { getAxiosInstance, setupAxiosInstance } from '../services/axiosInstance';
import ProfilePage from '@/app/(tabs)/profile';
import { calculateAge } from '@/utils/helpers/ageOfUser';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/state/store';
import { UserState } from '@/types/user';
import configureStore from 'redux-mock-store';

// Initialize axios-mock-adapter
const mockStore = configureStore([]);
// const mock = new axiosMockAdapter(getAxiosInstance());
let mock: axiosMockAdapter;

describe('ProfilePage Component', () => {

  const mockUserData: UserState = {
    id: '12345', 
    keycloakId: 'keycloak-12345',
    email: 'mockuser@email.com',
    username: 'mockUsername',
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      postalCode: 'H3Z 2Y7',
      phoneNumber: '5141234567',
      sportsOfPreference: [
        { name: 'Soccer', ranking: 'A' },
        { name: 'Basketball', ranking: 'B' },
      ],
      ranking: 'Pro',
    },
    preferences: {
      notifications: true,
      language: 'en',
    },
  };
  const store = mockStore({ user: mockUserData });


  const expectedAge = calculateAge(mockUserData);

  beforeAll(() => {
    setupAxiosInstance(jest.fn()); // Pass a mock dispatch function
    mock = new axiosMockAdapter(getAxiosInstance());
});

  afterEach(() => {
    mock.reset();
  });

  describe('Initial Loading State', () => {
    it('displays loading indicator initially', async () => {
      mock.onGet('/users/12345').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );

      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
    });
  });

  describe('User Profile Data Rendering', () => {
    it('renders user profile data with first and last name', async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('firstName')).toHaveTextContent('Jane Doe', {normalizeWhitespace: true});
      });
    });

    it('displays age correctly based on date of birth', async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
      );
      // Wait for loading to complete before proceeding
      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
      await waitFor(() => fireEvent.press(screen.getByTestId('About'))); // Navigate to About tab
      await waitFor(() => { expect(screen.getByTestId('Age')).toHaveTextContent(`Age: 34`); });
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );
      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
    });

    it('displays Activity, Stats, and About tabs', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('Activity')).toBeTruthy();
        expect(screen.getByTestId('Friends')).toBeTruthy();
        expect(screen.getByTestId('About')).toBeTruthy();
      });
    });

    it('navigates to the About tab and displays user information', async () => {
      await waitFor(() => fireEvent.press(screen.getByTestId('About')));

      await waitFor(() => {
        expect(screen.getByTestId('Gender')).toHaveTextContent('Female');
        expect(screen.getByTestId('Age')).toHaveTextContent('Age: 34');
        expect(screen.getByTestId('Phone')).toHaveTextContent('5141234567');
      });
    });
  });
});
