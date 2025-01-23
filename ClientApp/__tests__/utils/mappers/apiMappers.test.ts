import { mapApiResponseToUserState, mapProfiletoApiRequest } from '@/utils/mappers/apiMappers';
import { UserState, Profile } from '@/types';

describe('User Utilities', () => {
  describe('mapApiResponseToUserState', () => {
    it('should correctly map the API response to UserState', () => {
      const apiResponse = {
        id: '123',
        keycloakId: 'abc',
        email: 'user@example.com',
        username: 'user1',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          postalCode: '12345',
          phoneNumber: '123-456-7890',
          sportsOfPreference: [{ name: 'Soccer', ranking: 'A' }],
          ranking: 'Beginner',
        },
        preferences: {
          notifications: true,
          language: 'en',
        },
      };

      const expectedUserState: UserState = {
        id: '123',
        keycloakId: 'abc',
        email: 'user@example.com',
        username: 'user1',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          postalCode: '12345',
          phoneNumber: '123-456-7890',
          sportsOfPreference: [{ name: 'Soccer', ranking: 'A' }],
          ranking: 'Beginner',
        },
        preferences: {
          notifications: true,
          language: 'en',
        },
      };

      const result = mapApiResponseToUserState(apiResponse);

      expect(result).toEqual(expectedUserState);
    });

    it('should handle missing values in the API response', () => {
      const apiResponse = {
        id: '123',
        keycloakId: 'abc',
        email: 'user@example.com',
        username: 'user1',
        profile: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          postalCode: '',
          phoneNumber: '',
          sportsOfPreference: [],
          ranking: '',
        },
        preferences: {
          notifications: false,
          language: 'en',
        },
      };

      const expectedUserState: UserState = {
        id: '123',
        keycloakId: 'abc',
        email: 'user@example.com',
        username: 'user1',
        profile: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          postalCode: '',
          phoneNumber: '',
          sportsOfPreference: [],
          ranking: '',
        },
        preferences: {
          notifications: false,
          language: 'en',
        },
      };

      const result = mapApiResponseToUserState(apiResponse);

      expect(result).toEqual(expectedUserState);
    });
  });

  describe('mapProfiletoApiRequest', () => {
    it('should correctly map Profile to API request format', () => {
      const profile: Profile = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990/01/01',
        gender: 'Male',
        postalCode: '12345',
        phoneNumber: '123-456-7890',
        sportsOfPreference: [{ name: 'Soccer', ranking: 'A' }],
        ranking: 'Beginner',
      };

      const expectedApiRequest = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        postalCode: '12345',
        phoneNumber: '123-456-7890',
        sportsOfPreference: [{ name: 'Soccer', ranking: 'A' }],
        ranking: 'Beginner',
      };

      const result = mapProfiletoApiRequest(profile);

      expect(result).toEqual(expectedApiRequest);
    });

    it('should handle missing optional fields in Profile', () => {
      const profile: Profile = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: undefined,
        gender: undefined,
        postalCode: '',
        phoneNumber: '',
        sportsOfPreference: [],
        ranking: '',
      };

      const expectedApiRequest = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: undefined,
        gender: undefined,
        postalCode: '',
        phoneNumber: '',
        sportsOfPreference: [],
        ranking: '',
      };

      const result = mapProfiletoApiRequest(profile);

      expect(result).toEqual(expectedApiRequest);
    });
  });
});
