import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

interface EventLocationMapProps {
  latitude: number;
  longitude: number;
  showFullScreenButton?: boolean;
}

const EventLocationMap: React.FC<EventLocationMapProps> = ({
  latitude,
  longitude,
  showFullScreenButton = true,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>

      {showFullScreenButton && (
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsFullScreen(true)}
        >
          <Ionicons name="expand" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {isFullScreen && (
        <Modal visible={isFullScreen} animationType="slide">
          <View style={styles.fullScreenContainer}>
            <MapView
              style={styles.fullScreenMap}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFullScreen(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  fullScreenButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 20,
  },
  fullScreenContainer: {
    flex: 1,
    position: "relative",
  },
  fullScreenMap: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 20,
  },
});

export default EventLocationMap;
