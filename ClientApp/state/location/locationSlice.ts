import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LocationState = {
  latitude: 0,
  longitude: 0,
  permissionStatus: "denied",
  lastUpdated: null,
};

export interface LocationState {
  latitude: number | undefined;
  longitude: number | undefined;
  permissionStatus: "granted" | "denied" | "zip_code_based";
  lastUpdated: number | null;
}
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
        permissionStatus: "granted" | "zip_code_based";
      }>
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.permissionStatus = action.payload.permissionStatus;
      state.lastUpdated = Date.now();
    },
    setPermissionDenied: (state) => {
      state.permissionStatus = "denied";
    },
  },
});

export const { setLocation, setPermissionDenied } = locationSlice.actions;
export default locationSlice.reducer;