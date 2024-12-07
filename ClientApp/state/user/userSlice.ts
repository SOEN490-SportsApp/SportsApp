import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types';

const initialState: UserState = {
  id: "",
  keycloakId: "",
  email: "",
  username: "",
  profile: {
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    gender: "",
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
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
