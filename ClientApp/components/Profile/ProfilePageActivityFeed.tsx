import React from 'react';
import { View, StyleSheet } from 'react-native';
import EventList from '@/components/Event/EventList';
import { useSelector } from 'react-redux';
import { getEventsJoined } from '@/services/eventService';

const ProfilePageActivityFeed = () => {

  const user = useSelector((state: { user: any }) => state.user);
  const Location = useSelector((state: { location: any }) => state.location);
  

  return (
    <View testID = 'feed-container' style={styles.container}>
        <EventList
          forProfile = {true}
          fetchEventsFunction={(page, size) =>
            getEventsJoined(Location, user.id, page, size)}
      />
    </View>
  );
};

export default ProfilePageActivityFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10
  }
});
