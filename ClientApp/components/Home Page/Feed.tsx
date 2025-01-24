import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EventsList from '../Event/EventsListHomePage';

const Feed = () => {
  return (
    <View testID = 'feed-container' style={styles.container}>
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
