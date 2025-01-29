import { useDispatch } from "react-redux";
import { setUser, updateUserSports } from "@/state/user/userSlice";
import { UserState, SportPreference } from "@/types"; 
import { getUserById } from "@/state/user/api";
import { RootState } from "@/state/store";

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

      if (userData.profile.sportsOfPreference && userData.profile.sportsOfPreference.length > 0) {
        userData.profile.sportsOfPreference.forEach((sport: any) => {
          if (sport.name && sport.ranking) {
            dispatch(updateUserSports({ name: sport.name, ranking: sport.ranking }));
          } else {
            console.warn("Skipping invalid sport entry:", sport);
          }
        });
      }
    } catch (error) {
      console.error("Error updating user state:", error);
    }
  };

  return updateUserToStore;
};


export const selectUser = (state: RootState): UserState => state.user;


