import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EventsList from '../Event/EventsListHomePage';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { getCoordinatesFromPostalCode } from '../../utils/location/location';

const Feed = () => {

  const user = useSelector((state: { user: any }) => state.user);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== 'granted') {
        const result = await getCoordinatesFromPostalCode("H3B1A7");
          if ("error" in result) {
            console.log(result.error);
          } else {
            console.log(`Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
          }
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();

  }, [user.id]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View testID = 'feed-container' style={styles.container}>
      <Text> {text} </Text>
      <EventsList />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }
});
