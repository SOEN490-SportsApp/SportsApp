import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types';
import { RootState } from '@/state/store'; 

const initialState: UserState = {
  id: "",
  keycloakId: "",
  email: "",
  username: "",
  profile: {
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    gender: undefined,
    postalCode: "",
    phoneNumber: "",
    sportsOfPreference: [], 
    ranking: "",
  },
  preferences: {
    notifications: true,
    language: "en",
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      console.log("Redux Updated with:", action.payload);
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Add Selector Function to Access User in Redux
export const selectUser = (state: RootState) => state.user;




