import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface EventLocationMapProps {
  latitude: number;
  longitude: number;
}

const EventLocationMap: React.FC<EventLocationMapProps> = ({
  latitude,
  longitude,
}) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01, // Zoom level
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 200, // Adjust height as needed
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
});

export default EventLocationMap;
