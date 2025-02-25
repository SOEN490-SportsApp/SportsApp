import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert, Animated } from "react-native";
import TopBar from "@/components/Home Page/TopBar";
import Feed from "@/components/Home Page/Feed";
import MyCalendar from "@/components/Calendar/MyCalendar";
import { getAllEvents } from "@/services/eventService";
import { Event } from "@/types/event";
import { useSelector } from "react-redux";

const HomePage = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = React.useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCalendarVisible, setIsCalenarVisible] = useState(false)
    const user = useSelector((state: { user: any }) => state.user);
  const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
  
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

    

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* TopBar */}
      <TopBar onPress={() => setIsCalenarVisible(!isCalendarVisible)}/>

      {/* Feed */}
      <View style={styles.content}>
        <MyCalendar userId={user.id as string} isVisible={isCalendarVisible}/>
        <Feed />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
