import userReducer, { setUser, clearUser } from '@/state/user/userSlice';
import { UserState } from '@/types';

describe('userSlice', () => {
  const initialState: UserState = {
    id: '',
    keycloakId: '',
    email: '',
    username: '',
    profile: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      gender: undefined,
      postalCode: '',
      phoneNumber: '',
      sportsOfPreference: [],
      ranking: '',
    },
    preferences: {
      notifications: true,
      language: 'en',
    },
  };

  it('should return the initial state when called with an empty action', () => {
    const action = { type: '' };
    const state = userReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('should set the user data when setUser is dispatched', () => {
    const user: UserState = {
      id: '1',
      keycloakId: 'keycloak-1',
      email: 'user@example.com',
      username: 'testuser',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        postalCode: '12345',
        phoneNumber: '123456789',
        sportsOfPreference: [],
        ranking: 'A',
      },
      preferences: {
        notifications: true,
        language: 'en',
      },
    };

    const action = setUser(user);
    const state = userReducer(initialState, action);
    expect(state).toEqual(user);
  });

  it('should clear the user data when clearUser is dispatched', () => {
    const action = clearUser();
    const state = userReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});
