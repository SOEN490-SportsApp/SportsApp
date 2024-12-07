import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/userSlice';
import { UserState } from '@/types';
import { getUserById } from '@/state/user/api';

/**
 * Custom hook to fetch user data by ID and update the Redux store.
 * @returns A function to fetch and update user data
 */
export const useUpdateUserToStore = () => {
  const dispatch = useDispatch();

  const updateUserToStore = async (userId: string) => {
    try {
      const userData: UserState = await getUserById(userId);
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  };

  return updateUserToStore;
};
