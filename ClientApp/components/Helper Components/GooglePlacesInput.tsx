import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import themeColors from "@/utils/constants/colors";

interface GooglePlacesInputProps {
  setLocation: (location: any) => void;
  clearTrigger: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface LocationData {
  name: string;
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  coordinates: {
    coordinates: [number, number];
    type: string;
  }
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setLocation,
  clearTrigger,
  onFocus,
  onBlur,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    if (clearTrigger) {
      ref.current?.clear();
      setSelectedLocation(null);
    }
  }, [clearTrigger]);

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search for a location"
        minLength={2}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const fullAddress = details.formatted_address || "";
            const locationData = {
              name: details.name || fullAddress,
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
              coordinates: {
                coordinates: [
                  details.geometry.location.lng as number,
                  details.geometry.location.lat as number,
                ] as [number, number],
                type: "Point",
              },
            };

            setSelectedLocation(locationData);
            setLocation(locationData);
          }
        }}
        textInputProps={{
          onFocus,
          onBlur: () => {
            ref.current?.blur();
            if (onBlur) onBlur();
          },
        }}
        query={{
          key: process.env.EXPO_PUBLIC_API_GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        keyboardShouldPersistTaps="handled"
        styles={{
          textInputContainer: {
            backgroundColor: "#fff",
            borderRadius: 30,
            borderWidth: 1,
            borderColor: themeColors.primary,
            paddingHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            marginBottom: 10,
          },
          textInput: {
            height: 50,
            fontSize: 16,
            color: themeColors.text.dark,
          },
          listView: {
            position: "absolute",
            top: 60,
            width: "100%",
            borderRadius: 10,
            backgroundColor: "#fff",
            borderColor: themeColors.primary,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          row: {
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          },
          poweredContainer: {
            display: "none",
            height: 0,
            opacity: 0,
          },
        }}
        renderLeftButton={() => (
          <Ionicons
            name="search-outline"
            size={20}
            color={themeColors.primary}
            style={{ marginLeft: 10, alignSelf: "center" }}
          />
        )}
        renderRightButton={() => (
          <TouchableOpacity onPress={() => ref.current?.clear()} style={{ marginRight: 10, alignSelf: "center" }}>
            <Ionicons
              name="close-circle-outline"
              size={20}
              color={themeColors.primary}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GooglePlacesInput;
