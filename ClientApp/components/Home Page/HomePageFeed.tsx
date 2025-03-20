import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import EventsList from '../Event/EventsListHomePage';
import { useDispatch, useSelector } from 'react-redux';
import { calculateDistanceBetweenEventAndUserLocation, requestAndStoreLocation } from '@/services/locationService';
import EventListSkeleton from '../Event/EventListSkeleton';
import { getAllRelevantEvents } from '@/services/eventService';
import { Event } from "@/types/event";


const HomePageFeed = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const [isLocationFetching, setIsLocationFetching] = useState(true);
 
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLocationFetching(true);
      await requestAndStoreLocation(dispatch, user.profile.postalCode);
      setTimeout(() => setIsLocationFetching(false), 700);
    };
    fetchLocation();
  }, [user.id]);
  
  return (
    <View testID = 'feed-container' style={styles.container}>
      {isLocationFetching ? (
        <EventListSkeleton />
      ) : (
        <EventsList />
      )}
    </View>
  );
};

export default HomePageFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }
});
