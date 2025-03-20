import React from 'react';
import { View, StyleSheet } from 'react-native';
import EventList from '@/components/Event/EventList';
import { useSelector } from 'react-redux';
import { getEventsCreated } from '@/services/eventService';

const ProfilePageActivityFeed = () => {

  const user = useSelector((state: { user: any }) => state.user);
  const Location = useSelector((state: { location: any }) => state.location);
  
  return (
    <View testID = 'feed-container' style={styles.container}>
        <EventList
          fetchEventsFunction={(page, size) =>
            getEventsCreated(user.id, page, size)
        }
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
