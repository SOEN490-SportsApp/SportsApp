import { useUpdateUserToStore } from '@/state/user/actions';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/userSlice';
import { getUserById } from '@/state/user/api';
import { UserState } from '@/types';

jest.mock('@/state/user/api', () => ({
  getUserById: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useUpdateUserToStore', () => {
  it('should fetch user data and dispatch setUser action', async () => {
    const mockUserData: UserState = {
        id: "123",
        keycloakId: "mock-keycloak-id",
        email: "test@example.com",
        username: "testuser",
        profile: {
          firstName: "Test",
          lastName: "User",
          dateOfBirth: '2000-01-01', 
          gender: "male", 
          postalCode: "12345",
          phoneNumber: "123-456-7890",
          sportsOfPreference: [{name: "basketball", ranking:"Advanced"}], 
          ranking: "beginner",
        },
        preferences: {
          notifications: false, 
          language: "es",
        },
      };    (getUserById as jest.Mock).mockResolvedValue(mockUserData);
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    const updateUserToStore = useUpdateUserToStore();

    await updateUserToStore('123');

    expect(getUserById).toHaveBeenCalledWith('123');
    expect(mockDispatch).toHaveBeenCalledWith(setUser(mockUserData));
  });

    it('should handle errors and log to console', async () => {
    const mockError = new Error('Failed to fetch user');
    (getUserById as jest.Mock).mockRejectedValue(mockError);
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    const updateUserToStore = useUpdateUserToStore();

    await updateUserToStore('123');

    expect(getUserById).toHaveBeenCalledWith('123');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating user state:', mockError);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});