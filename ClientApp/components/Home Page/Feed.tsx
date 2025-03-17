import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import EventsList from '../Event/EventsListHomePage';
import { useDispatch, useSelector } from 'react-redux';
import { requestAndStoreLocation } from '@/services/locationService';
import EventCardSkeleton from '../Event/EventCardSkeleton';

const Feed = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const Location = useSelector((state: { location: any }) => state.location);
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
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <EventCardSkeleton />}
        />
      ) : (
        <EventsList />
      )}
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
