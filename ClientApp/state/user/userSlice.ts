import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, SportPreference } from "@/types"; 

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
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
    updateUserSports(state, action: PayloadAction<SportPreference>) { 
      const { name, ranking } = action.payload; 

      // Check if the sport already exists, update ranking if needed
      const existingSport = state.profile.sportsOfPreference.find((s) => s.name === name);
      if (existingSport) {
        existingSport.ranking = ranking;
      } else {
        state.profile.sportsOfPreference.push({ name, ranking });
      }
    },
  },
});

export const { setUser, clearUser, updateUserSports } = userSlice.actions;
export default userSlice.reducer;


