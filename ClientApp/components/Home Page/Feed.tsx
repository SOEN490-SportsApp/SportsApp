import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import EventsList from '../Event/EventsListHomePage';

const Feed = () => {
  return (
    <View style={styles.container}>
      <EventsList />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 15,
    backgroundColor: '#0C9E04',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
