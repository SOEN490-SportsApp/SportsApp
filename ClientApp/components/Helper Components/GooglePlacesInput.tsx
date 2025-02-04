import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";

interface GooglePlacesInputProps {
  setLocation: (location: any) => void;
  clearTrigger: boolean;
}

interface LocationData {
  name: string;
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setLocation,
  clearTrigger,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  useEffect(() => {
    if (clearTrigger) {
      setSelectedLocation(null);
    }
  }, [clearTrigger]);

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        minLength={2}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const locationData = {
              name: details.name,
              streetNumber:
                details.address_components.find((comp) =>
                  comp.types.includes("street_number")
                )?.long_name || "",
              streetName:
                details.address_components.find((comp) =>
                  comp.types.includes("route")
                )?.long_name || "",
              city:
                details.address_components.find((comp) =>
                  comp.types.includes("locality")
                )?.long_name || "",
              province:
                details.address_components.find((comp) =>
                  comp.types.includes("administrative_area_level_1")
                )?.long_name || "",
              country:
                details.address_components.find((comp) =>
                  comp.types.includes("country")
                )?.long_name || "",
              postalCode:
                details.address_components.find((comp) =>
                  comp.types.includes("postal_code")
                )?.long_name || "",
              latitude: details.geometry.location.lat.toString(),
              longitude: details.geometry.location.lng.toString(),
            };

            setSelectedLocation(locationData);
            setLocation(locationData);
          }
        }}
        query={{
          key: process.env.EXPO_PUBLIC_API_GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        styles={{
          textInput: {
            height: 50,
            borderWidth: 1,
            paddingHorizontal: 10,
          },
          listView: {
            borderWidth: 1,
            borderColor: "#ccc",
            backgroundColor: "white",
          },
          poweredContainer: {
            display: "none",
            height: 0,
            opacity: 0,
          },
          powered: {
            display: "none",
            height: 0,
            opacity: 0,
          },
        }}
      />
    </View>
  );
};

export default GooglePlacesInput;
