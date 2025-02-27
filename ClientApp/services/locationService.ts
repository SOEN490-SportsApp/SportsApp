import * as Location from "expo-location";
import { AppDispatch } from "../state/store";
import { setLocation, setPermissionDenied } from "../state/location/locationSlice";
import { getCoordinatesFromPostalCode } from "../utils/location/location";


export const requestAndStoreLocation = async (dispatch: AppDispatch, zipCode: string) => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === "granted") {
      // Fetch live GPS coordinates
      const userLocation = await Location.getCurrentPositionAsync({});
      dispatch(setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        permissionStatus: "granted",
      }));
      return;
    } else {
      dispatch(setPermissionDenied());
    }

    // If permission is denied, use zip code to get coordinates
    console.log("Location permission denied. Using zip code instead.");
    const zipLocation = await getCoordinatesFromPostalCode(zipCode);

    if (!zipLocation.error) {
      dispatch(setLocation({
        latitude: zipLocation.latitude ?? 0,
        longitude: zipLocation.longitude ?? 0,
        permissionStatus: "zip_code_based",
      }));
    } else {
      console.error("Error retrieving fallback location:", zipLocation.error);
    }
  } catch (error) {
    console.error("Error in requestAndStoreLocation:", error);
  }
};
