import React, { useEffect, useRef } from 'react';
import { FlatList, View, StyleSheet, Alert, Animated, RefreshControl, Text, ActivityIndicator } from 'react-native';
import EventCard from './EventCard';
import { Event } from '@/types/event';
import { router } from 'expo-router';
import { mvs } from '@/utils/helpers/uiScaler';
import { getEventsCreated } from '@/services/eventService';

const EventsList = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEventsCreated();

      //TODO won't have to use this
      const validEvents = eventsData.filter((event: Event) => {
        const cutoffTime = new Date(event.cutOffTime);
        return !isNaN(cutoffTime.getTime());
      });

      setEvents(validEvents);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading events...</Text>
      </View>
    );
  }
  
  return (
    <View>
      <View style={styles.container}>

        {/* TODO Animated.FlatList is a wrapper around FlatList incase i want to add animation to the scroll */}
        <FlatList
          data={events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={handleEventPress} isForProfile={true} />
          )}
          // Adding pull-to-refresh functionality
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>


  );
};

export default EventsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 0,
    marginBottom: mvs(60)
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
