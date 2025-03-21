import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import EventsList from '@/components/Event/EventList';
import { useDispatch, useSelector } from 'react-redux';
import { calculateDistanceBetweenEventAndUserLocation, requestAndStoreLocation } from '@/services/locationService';
import EventListSkeleton from '../Event/EventListSkeleton';
import { getAllRelevantEvents } from '@/services/eventService';
import { Event } from "@/types/event";


const HomePageFeed = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const [isLocationFetching, setIsLocationFetching] = useState(true);
  
  const Location = useSelector((state: { location: any }) => state.location);

  // ⏳ Fetch user location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLocationFetching(true);
      await requestAndStoreLocation(dispatch, user.profile.postalCode);
      setTimeout(() => setIsLocationFetching(false), 700); // slight delay for smoother UX
    };
    fetchLocation();
  }, [user.id]);

  return (
    <View testID="feed-container" style={styles.container}>
      {!isLocationFetching && (
        <EventsList
          forProfile = {false}
          fetchEventsFunction={(page, size) =>
            getAllRelevantEvents(Location, 15, true, true, page, size)
          }
        />
      )}
    </View>
  );
};

export default HomePageFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
});
